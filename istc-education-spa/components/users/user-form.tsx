'use client';
import { getUserByEmail } from "@/utils/api/users";
import { idahoCounties, states } from "@/utils/forms/constants";
import { ChangeEvent, useEffect, useState } from "react";
import TextInput from "../form/text-input";
import EmailInput from "../form/email-input";
import CustomPhoneInput from "../form/phone-input";
import SelectInput from "../form/select-input";
import { validateLength, validatePhone, validateZip } from "@/utils/forms/validation";
import { useRouter } from "next/navigation";
import { handleIntInput } from "@/utils/forms/handlers";

interface UserFormProps {
    user?: User;
    IPId?: string;
    submitText?: string;
    goBack?: boolean;    
    onError: (error: string) => void;
    onSubmit: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user: incomingUser, IPId, submitText = "Submit", goBack = false, onSubmit, onError }) => {
    const [user, setUser] = useState<User>({
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
    const [ errors, setErrors ] = useState<FormError>({});
    const [ isEmailChecking, setIsEmailChecking ] = useState<boolean>(false);
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // If user.employer.employerName is not any of the idahoCounties.
        if (incomingUser) {
            if (incomingUser.employer && 
                !idahoCounties.includes(incomingUser.employer.employerName) &&
                incomingUser.employer.employerName !== 'Tax Commission') {
                    // Now set the user to incomingUser but with employer.employerName set to 'Other'
                    const incomingUserCopy = { ...incomingUser,
                        employer: {
                            ...incomingUser.employer,
                            employerName: 'Other',
                        }
                    };
                    setUser(incomingUserCopy);
                    setOtherEmployer(incomingUser.employer.employerName);
            } else {
                setUser(incomingUser);
            }
        }
    }, []);

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

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submittingUser = user;   
        if (otherEmployer !== null && submittingUser.employer) {
            submittingUser.employer.employerName = otherEmployer;
        }
        
        onSubmit(submittingUser);
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
            if (user.employer?.employerName === 'Other') {
               
                return otherEmployer !== null && otherEmployer.trim() !== '';
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
                    label="Email"
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
                options={['Initial', 'Other', 'Tax Commission', ...idahoCounties]}
                value={user.employer?.employerName || 'Initial'}
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
            />
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
            <div className="flex justify-end gap-2">
                {goBack && (
                    <button
                        className="btn btn-error dark:text-white"
                        onClick={() => router.back()}
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

