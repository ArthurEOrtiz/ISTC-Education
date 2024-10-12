'use client';
import { getUserByEmail } from "@/utils/api/users";
import { idahoCounties, states } from "@/utils/forms/constants";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import TextInput from "../form/text-input";
import EmailInput from "../form/email-input";
import CustomPhoneInput from "../form/phone-input";
import SelectInput from "../form/select-input";
import { validateLength, validatePhone, validateZip } from "@/utils/forms/validation";
import { useRouter } from "next/navigation";
import { handleIntInput } from "@/utils/forms/handlers";

interface UserFormProps {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
    otherEmployerChange?: (value: string | null) => void;
    submitText?: string;
    submitting?: boolean;
    goBack?: boolean;    
    onError: (error: string) => void;
    onSubmit?: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, setUser, otherEmployerChange, submitText = "Submit", submitting = false,  goBack = false, onSubmit, onError }) => {
    const [ otherEmployer, setOtherEmployer ] = useState<string | null>(null);
    const [ errors, setErrors ] = useState<FormError>({});
    const [ isEmailChecking, setIsEmailChecking ] = useState<boolean>(false);
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // If the employer name is not any of the predefined options(counties or "Tax Commision"), set it to 'Other'
        if (!idahoCounties.includes(user.employer.employerName) && 
            user.employer.employerName !== 'Tax Commission' &&
            user.employer.employerName !== 'Initial') {
            setOtherEmployer(user.employer.employerName);
            setUser(prev => ({
                ...prev,
                employer: {
                    ...prev.employer,
                    employerName: 'Other',
                },
            }));
        }
    }, []);

    useEffect(() => {
        setIsFormValid(
            requiredFieldsFilled() && Object.values(errors).every(error => error === '')
        );
    }, [
        user.firstName, 
        user.lastName, 
        user.contact.email, 
        user.employer.employerName,
        user.employer.jobTitle,
        otherEmployer,
        errors
    ]);
    
    useEffect(() => {
        if (otherEmployerChange) {
            otherEmployerChange(otherEmployer);
        }
    }, [otherEmployer]);

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submittingUser = user;   
        if (otherEmployer !== null) {
            submittingUser.employer.employerName = otherEmployer;
        }
        
      
        onSubmit && onSubmit(submittingUser);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        // first if the value is a string remove any leading or trailing whitespace
        if (typeof value === 'string') {
            value.trim();
        }

        switch(true) {
            case id === 'check-email':
                break;
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
                            [employerField]: value
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
                    [id]: value === '' ? null : value,  
                }));
        }

    }

    const handleValidation = async (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const formErrors: FormError = {};
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
            case 'check-email':
                formErrors["contact.email"] = value === user.contact.email ? '' : 'Emails do not match';
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

        if (id !== 'check-email'){
            setErrors(prev => ({
                ...prev,
                [id]: formErrors[id],
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                'contact.email': formErrors['contact.email'],
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
                        return '';
                    }
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
            if (user.employer.employerName === 'Other') {
                return otherEmployer !== null && otherEmployer.trim() !== '';
            }

            if(user.employer.employerName === 'Initial') {
                return false;
            }
            return true;
        }

        return false;
    }

    return (
        <form onSubmit={handleOnSubmit} className="max-w-2xl space-y-2">
            <TextInput
                id="firstName"
                label="First Name"
                placeholder="John"
                defaultValue={user.firstName}
                onBlur={handleValidation}
                onChange={handleChange}
                error={errors['firstName']}
                required
            />
            <TextInput
                id="middleName"
                label="Middle Name"
                placeholder="Ray"
                defaultValue={user.middleName || ''}
                onBlur={handleValidation}
                onChange={handleChange}
                error={errors['middleName']}
            />
            <TextInput
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                defaultValue={user.lastName}
                onBlur={handleValidation}
                onChange={handleChange}
                error={errors['lastName']}
                required
            />
            <div className="w-full sm:flex sm:justify-between sm:items-baseline sm:space-x-2 space-y-2">
                <EmailInput
                    id="contact.email"
                    placeholder="some@example.com"
                    defaultValue={user.contact?.email}
                    onBlur={handleValidation}
                    onChange={handleChange}
                    error={errors['contact.email']}
                    isEmailChecking={isEmailChecking}
                    required
                />
                <CustomPhoneInput
                    label="Phone"
                    id="contact.phone"
                    defaultCountry="US"
                    value={user.contact?.phone as string}
                    onBlur={handleValidation}   
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
                    error={errors['contact.phone']}
                />
            </div>
            <TextInput
                id="contact.addressLine1"
                label="Address Line 1"
                placeholder="123 Main St"
                defaultValue={user.contact?.addressLine1 || ''}
                onBlur={handleValidation}
                onChange={handleChange}
                error={errors['contact.addressLine1']}
            />
            <TextInput
                id="contact.addressLine2"
                label="Address Line 2"
                placeholder="Apt 101"
                defaultValue={user.contact?.addressLine2 || ''}
                onBlur={handleValidation}
                onChange={handleChange}
                error={errors['contact.addressLine2']}
            />
            <div className="w-full sm:flex sm:justify-between sm:items-baseline space-y-2">
                <div className="sm:w-1/3">
                    <TextInput
                        id="contact.city"
                        label="City"
                        placeholder="Boise"
                        defaultValue={user.contact?.city || ''}
                        onBlur={handleValidation}
                        onChange={handleChange}
                        error={errors['contact.city']}
                    />
                </div>
           
                
                <div className="sm:w-1/3 w-full">
                    <SelectInput
                        id="contact.state"
                        options = {states}
                        value={user.contact?.state || 'Idaho'}
                        onChange={handleChange}
                    />
                </div>
  

                <div className="sm:w-1/3">
                    <TextInput
                        id="contact.postalCode"
                        label="Zip"
                        placeholder="83702"
                        defaultValue={user.contact?.postalCode || ''}
                        onBlur={handleValidation}
                        onChange={handleChange}
                        onInput={handleIntInput}
                        error={errors['contact.postalCode']}
                    />
                </div>
            </div>
            <SelectInput
                id="employer.employerName"
                value={user.employer?.employerName === "Other" ? (otherEmployer ?? '') : user.employer?.employerName ?? ''}
                onBlur={handleValidation}
                onChange={(e) => {
                    const { value } = e.target;
                    if (value === 'Other') {
                        setOtherEmployer('');
                    } else {
                        setOtherEmployer(null);
                    }
                    handleChange(e);
                }}
                error={errors['employer.employerName']}
                required
            >
                <option value="Initial" disabled>Select Employer</option>
                <option value="Other">Other</option>
                <option value="Tax Commission">Tax Commission</option>
                {idahoCounties.map((county, index) => (
                    <option key={index} value={county}>{county}</option>
                ))}
            </SelectInput>
            {otherEmployer !== null &&
                <TextInput
                    id="employer.otherEmployerName"
                    label="Other Employer"
                    placeholder="Simplot"
                    defaultValue={otherEmployer}
                    onBlur={handleValidation}
                    onChange={handleChange}
                    error={errors['employer.otherEmployerName']}
                    required
                />
            }
            <TextInput
                id="employer.jobTitle"
                label="Job Title"
                placeholder="Software Developer"
                defaultValue={user.employer?.jobTitle || ''}
                onBlur={handleValidation}
                onChange={handleChange}
                error={errors['employer.jobTitle']}
                required
            />
            <div className="border-b p-2"/>
            <div className="flex justify-between">
                {goBack && (
                    <button
                        className="btn btn-info"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                )}
                {onSubmit && (
                <button 
                    type="submit"
                    className="btn btn-success dark:text-white"
                    disabled={!isFormValid || submitting}
                >
                    {submitting ? <span className="loading loading-spinner"></span> : submitText}
                </button>
                )}
            </div>
        </form>
    )
}

export default UserForm;

