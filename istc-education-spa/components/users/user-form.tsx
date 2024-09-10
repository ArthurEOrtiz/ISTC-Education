'use client';
import { User } from "@/types/user";
import { getUserByEmail } from "@/utils/api/users";
import { idahoCounties, states } from "@/utils/constants";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input/input";

interface UserFormProps {
    user?: User;
    IPId?: string;
    submitText?: string;
    goBack?: boolean;    
    onError: (error: string) => void;
    onSubmit: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user: incomingUser, IPId, submitText = "Submit", goBack = false, onSubmit, onError }) => {
    const [user, setUser] = useState<User>(incomingUser || {
        userId: 0,
        ipId: IPId || '',
        status: 'Active',
        firstName: '',
        lastName: '',
        middleName: null,
        isAdmin: false,
        isStudent: true,
        contact: {
            contactId: 0,
            userId: 0,
            email: '',
            phone: null,
            addressLine1: null,
            addressLine2: null,
            city: 'Boise',
            state: 'Idaho',
            postalCode: null,
        },
        employer: {
            employerId: 0,
            userId: 0,
            employerName: 'Initial',
            jobTitle: '',
        },
        student: {
            studentId: 0,
            userId: 0,
            appraiserCertified: false,
            mappingCertified: false,
        },
    } as User);
    const [ otherEmployer, setOtherEmployer ] = useState<string | null>(null);
    const [ errors, setErrors ] = useState<{ [key: string]: string}>({});
    const [ isEmailChecking, setIsEmailChecking ] = useState<boolean>(false);
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);

    useEffect(() => {
        setIsFormValid(
            requiredFieldsFilled() && Object.values(errors).every(error => error === '')
        );
    }, [
        user.firstName, 
        user.lastName, 
        user.contact?.email, 
        user.employer?.employerName,
        user.employer?.jobTitle,
        otherEmployer,
        errors
    ]);    

    const handleZipInput = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        input.value = input.value.replace(/[^0-9]/g, '');
    };

    const handleEmpoyerNameDefaultValue = () => {
        if (user.employer){
            const { employerName } = user.employer;
   
            if (employerName !== idahoCounties.find(county => county === employerName) && employerName !== 'Tax Commission' && employerName !== 'Initial' && employerName !== 'Other') {
                if (otherEmployer !== employerName) setOtherEmployer(employerName);
                return 'Other';
            } else {
                return employerName;
            }
        }
    }

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const submittingUser = user;   
        if (otherEmployer !== null && submittingUser.employer) {
            submittingUser.employer.employerName = otherEmployer;
        }
        onSubmit(submittingUser);
        e.preventDefault();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        switch(true) {
            case id.startsWith('contact'):
                const contactField = id.split('.')[1];
                setUser(prev => {
                    if (!prev.contact) {
                        throw new Error('Contact object is missing from user object');
                    }
                    return {
                        ...prev,
                        contact: {
                            ...prev.contact,
                            [contactField]: value,
                        },
                    };
                });
                break;
            case id.startsWith('employer'):
                const employerField = id.split('.')[1];
                if (employerField === 'otherEmployerName') {
                    setOtherEmployer(value);
                    break;
                }

                setUser(prev => {
                    if (!prev.employer) {
                        throw new Error('Employer object is missing from user object');
                    }
                    return {
                        ...prev,
                        employer: {
                            ...prev.employer,
                            [employerField]: value,
                        },
                    };
                });
                break;
            case id.startsWith('student'):
                const studentField = id.split('.')[1];
                setUser(prev => {
                    if (!prev.student) {
                        throw new Error('Student object is missing from user object');
                    }
                    return {
                        ...prev,
                        student: {
                            ...prev.student,
                            [studentField]: value,
                        },
                    };
                });
                break;
            default:
                setUser(prev => ({
                    ...prev,
                    [id]: value,
                }));
        }

    }

    const validateEmail =  async (email: string) => {
        setIsEmailChecking(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            setIsEmailChecking(false);
            return '';
        }

        if (!emailRegex.test(email)) {
            setIsEmailChecking(false);
            return 'Invalid email address';
        } else {
            const response = await getUserByEmail(email)
                .then((response) => {
                    if (!response) {
                        console.log('Email address is available');
                        return '';
                    }
                    console.log('Email address already in use', response);
                    return 'Email address already in use';
                })
                .catch(() => {
                    onError('An error occurred. Please try again later.');
                    return 'An error occurred. Please try again later.';
                })
                .finally(() => {
                    setIsEmailChecking(false);
                }
            );

            return response as string;
        }
    };
    
    const validatePhone = (phone: string) => {
        const phoneRegex = /^1?\s?\(?([0-9]{3})\)?\s?([0-9]{3})[-.●]?([0-9]{4})$/;
        return phone === '' || phoneRegex.test(phone) ? '' : 'Invalid phone number';
    };

    const validateZip = (zip: string) => {
        const zipRegex = /^[0-9]{5}$/;
        return zip === '' || zipRegex.test(zip) ? '' : 'Invalid zip code';
    }
    
    const validateLength = (value: string, minLength: number, maxLength: number) => {
        return value.length >= minLength && value.length <= maxLength;
    }

    const requiredFieldsFilled = () => {
        const requiredFields = ['firstName', 'lastName', 'contact.email', 'employer.employerName', 'employer.jobTitle'];
        
        const allRequiredFieldsFilled = requiredFields.every(field => {
            const fieldParts = field.split('.');
            let value: any = user;
            
            for (const part of fieldParts) {
                if (value[part] === undefined)  {
                    return false;
                }
                value = value[part];
            }
    
            return value !== '';
        });

        if (allRequiredFieldsFilled) {
            if (user.employer?.employerName === 'Other') {
               
                return otherEmployer !== null && otherEmployer.trim() !== '';
            }
            return true;
        }

        return false;
    }

    const validateForm = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const formErrors: { [key: string]: string} = {};
        const { id, value } = e.target;

        switch(id) {
            case 'firstName':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'First name must be between 3 and 50 characters';
                break;
            case 'lastName':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'Last name must be between 3 and 50 characters';
                break;
            case 'middleName':
                formErrors[id] = value === '' ? '' : validateLength(value, 3, 50) ? '' : 'Middle name must be between 3 and 50 characters';
                break;
            case 'contact.email':
                formErrors[id] =  await validateEmail(value);
                break;
            case 'contact.phone':
                formErrors[id] = validatePhone(value);
                break;
            case 'contact.addressLine1':
                formErrors[id] = value === '' ? '' : validateLength(value, 3, 50) ? '' : 'Address must be between 3 and 50 characters';
                break;
            case 'contact.addressLine2':
                formErrors[id] = value === '' ? '' : validateLength(value, 3, 50) ? '' : 'Address must be between 3 and 50 characters';
                break;
            case 'contact.city':
                formErrors[id] = value === '' ? '' : validateLength(value, 3, 50) ? '' : 'City must be between 3 and 50 characters';
                break;
            case 'contact.postalCode':
                formErrors[id] = validateZip(value);
                break;
            case 'employer.employerName':
                formErrors[id] = value !== 'initial' ? '' : 'Employer name is required';
                break;
            case 'employer.jobTitle':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'Job title must be between 3 and 50 characters';
                break;
            case 'employer.otherEmployerName':
                if (otherEmployer !== null) formErrors[id] = validateLength(value, 3, 50) ? '' : 'Employer name must be between 3 and 50 characters';
                break;
        }

        setErrors(prev => ({
            ...prev,
            [id]: formErrors[id],
        }));
    }

    return (
        <form onSubmit={handleOnSubmit} className="space-y-2">
            <div className="border border-error rounded-md p-1">
                <label className="input input-bordered flex items-center gap-2">
                    First Name
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="John"
                        id="firstName"
                        defaultValue={user.firstName}
                        onBlur={validateForm}
                        onChange={handleChange}
                        />
                </label>
                {errors['firstName'] && <p className="text-sm text-error mt-1">{errors['firstName']}</p>}
                <p className="text-sm text-error mt-1">Required</p>
            </div>
            <div>
                <label className="input input-bordered flex items-center gap-2">
                    Middle Name
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Ray"
                        id="middleName"
                        defaultValue={user.middleName || ''}
                        onBlur={validateForm}
                        onChange={handleChange}
                        />
                </label>
                {errors['middleName'] && <p className="text-sm text-error mt-1">{errors['middleName']}</p>}
            </div>
            <div className="border border-error rounded-md p-1">
                <label className="input input-bordered flex items-center gap-2">
                    Last Name
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Doe"
                        id="lastName"
                        defaultValue={user.lastName}
                        onBlur={validateForm}
                        onChange={handleChange}
                        />
                </label>
                {errors['lastName'] && <p className="text-sm text-error mt-1">{errors['lastName']}</p>}
                <p className="text-sm text-error">Required</p>
            </div>
            <div className="w-full sm:flex sm:justify-between sm:items-baseline sm:space-x-2 space-y-2">
                <div className="border border-error rounded-md p-1 md:w-1/2">
                    <label className="input input-bordered flex items-center gap-2">
                        Email
                        <input 
                            type="email" 
                            className="grow" 
                            placeholder="some@example.com" 
                            id="contact.email"
                            defaultValue={user?.contact?.email}
                            onBlur={validateForm}
                            onChange={handleChange}
                            />
                    </label>
                    {isEmailChecking && (
                        <div className="flex items-center gap-2">
                            <span className="loading loading-spinner loading-sm"></span>
                            <p className="text-sm text-success mt-1">Checking email...</p>
                        </div>
                    )}
                    {errors['contact.email'] && <p className="text-sm text-error mt-1">{errors['contact.email']}</p>}
                    <p className="text-sm text-error">Required</p>
                </div>
                <div className="sm:w-1/2">
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        Phone
                        <PhoneInput 
                            type="text" 
                            className="w-full" 
                            placeholder="555-555-5555" 
                            id="contact.phone"
                            defaultCountry="US"
                            value={user.contact?.phone as string}
                            onBlur={validateForm}   
                            onChange={(value) => {
                                if (user.contact) {
                                    setUser({
                                        ...user,
                                        contact: {
                                            ...user.contact,
                                            phone: value as string,
                                        },
                                    });
                                }
                            }}
                            />
                    </label>
                    {errors['contact.phone'] && <p className="text-sm text-error mt-1">{errors['contact.phone']}</p>}
                </div>
            </div>
            <div>
                <label className="input input-bordered flex items-center gap-2">
                    Address Line 1
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="123 Main St" 
                        id="contact.addressLine1"
                        defaultValue={user.contact?.addressLine1 || ''}
                        onBlur={validateForm}
                        onChange={handleChange}
                        />
                </label>
                {errors['contact.addressLine1'] && <p className="text-sm text-error mt-1">{errors['contact.addressLine1']}</p>}
            </div>
            <div>
                <label className="input input-bordered flex items-center gap-2">
                    Address Line 2
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Apt 101" 
                        id="contact.addressLine2"
                        defaultValue={user.contact?.addressLine2 || ''}
                        onBlur={validateForm}
                        onChange={handleChange}
                        />
                </label>
                {errors['contact.addressLine2'] && <p className="text-sm text-error mt-1">{errors['contact.addressLine2']}</p>}
            </div>
            <div className="w-full sm:flex sm:justify-between sm:items-baseline sm:space-x-2  space-y-2">
                <div className="sm:w-1/3">
                    <label className="input input-bordered flex items-center gap-2">
                        City
                        <input 
                            type="text" 
                            className="grow" 
                            placeholder="Boise" 
                            id="contact.city"
                            defaultValue={user.contact?.city ||''}
                            onChange={handleChange}
                            />
                    </label>
                    {errors['contact.city'] && <p className="text-sm text-error mt-1">{errors['contact.city']}</p>}
                </div>
                <select 
                    className="select select-bordered w-full"
                    id="contact.state"
                    onChange={handleChange}
                    defaultValue={user.contact?.state || 'Idaho'}
                    >
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
                <div className="sm:w-1/3">
                    <label className="input input-bordered flex items-center gap-2">
                        Zip
                        <input 
                            type="text"
                            className="grow" 
                            placeholder="83702" 
                            id="contact.postalCode"
                            defaultValue={user.contact?.postalCode || ''}
                            onBlur={validateForm}
                            onChange={handleChange}
                            onInput={handleZipInput}
                            />
                    </label>
                    {errors['contact.postalCode'] && <p className="text-sm text-error mt-1">{errors['contact.postalCode']}</p>}
                </div>
            </div>
            <div className="border border-error rounded-md p-1">
                <select 
                    id="employer.employerName"
                    defaultValue={handleEmpoyerNameDefaultValue()}
                    onBlur={validateForm}
                    onChange={(e) => {
                        const { value } = e.target;
                        if (value === 'Other') {
                            setOtherEmployer('');
                        } else {
                            setOtherEmployer(null);
                        }
                        handleChange(e);
                    }}
                    className="select select-bordered w-full">
                    <option disabled value="Initial">Select Employer</option>
                    <option value="Other">Other</option>
                    <option value="Tax Commission">Tax Commission</option>  
                    {idahoCounties.map((county, index ) => (
                        <option key={index} value={county}>{county}</option>
                    ))}
                </select>
                {errors['employer.employerName'] && <p className="text-sm text-error mt-1">{errors['employer.employerName']}</p>}
                <p className="text-sm text-error">Required</p>
            </div>
            {otherEmployer !== null &&
                <div className="border border-error rounded-md p-1">
                    <label className="input input-bordered flex items-center gap-2">
                        Other Employer
                        <input 
                            type="text" 
                            className="grow" 
                            placeholder="Simplot" 
                            id="employer.otherEmployerName"
                            defaultValue={otherEmployer}
                            onBlur={validateForm}
                            onChange={handleChange}
                            />
                    </label>
                    {errors['employer.otherEmployerName'] && <p className="text-sm text-error mt-1">{errors['employer.otherEmployerName']}</p>}
                    <p className="text-sm text-error">Required</p>
                </div>
            }
            <div className="border border-error rounded-md p-1">
                <label className="input input-bordered flex items-center gap-2">
                    Job Title
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Software Developer" 
                        id="employer.jobTitle"
                        defaultValue={user.employer?.jobTitle || ''}
                        onBlur={validateForm}
                        onChange={handleChange}
                        />
                </label>
                {errors['employer.jobTitle'] && <p className="text-sm text-error mt-1">{errors['employer.jobTitle']}</p>}
                <p className="text-sm text-error">Required</p>
            </div>
            <div className="flex justify-end gap-2">
                {goBack && (
                    <button
                        className="btn btn-error dark:text-white"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                )}
                <button 
                    type="submit"
                    className="btn btn-success dark:text-white"
                    disabled={!isFormValid}
                >
                    {submitText}
                </button>
            </div>
        </form>
    )
}

export default UserForm;

