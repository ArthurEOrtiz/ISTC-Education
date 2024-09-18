'use client';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TextInput from "../form/text-input";
import { validateEmail, validateLength, validateURL, validateZip } from "@/utils/forms/validation";
import { useRouter } from "next/navigation";
import TextAreaInput from "../form/textarea-input";
import DateInput from "../form/date-input";
import NumberInput from "../form/number-input";
import EmailInput from "../form/email-input";
import SelectInput from "../form/select-input";
import { states } from "@/utils/forms/constants";
import { handleIntInput } from "@/utils/forms/handlers";

interface CourseFormProps {
    course: Course;
    submitText?: string;
    goBack?: boolean;
    archivable?: boolean;
    onSubmit?: (course: Course) => void;
    setCourse: Dispatch<SetStateAction<Course>>;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, setCourse, submitText="Submit", goBack = false, archivable = false, onSubmit }) => {
    const [ errors, setErrors ] = useState<FormError>({}); 
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        updateCourseStatus();
    }, [course.classes]);


    useEffect(() => {
        const formErrors = Object.values(errors);
        setIsFormValid(formErrors.every(err => err === '') && requiredFieldsFilled());
    }, [course, errors]);

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit && onSubmit(course);
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        switch (true) {
            case id === "maxAttendance": 
            case id === "attendanceCredit":
                const intValue: number = value === '' ? 0 : parseInt(value);
                setCourse(prev => ({
                    ...prev,
                    [id]: intValue,
                }));
                break;
            case id === "hasExam":
                
                setCourse(prev => ({
                    ...prev,
                    [id]: !course.hasExam,
                }));
                break;
            case id === "examCredit":
                const examCredit: number | null = value === '' ? null : parseInt(value);
                setCourse(prev => ({
                    ...prev,
                    [id]: examCredit,
                }));
                break;
            case id.startsWith("location"):
                const locationField = id.split('.')[1];
                const newLocationValue = value === '' ? null : value;
                setCourse(prev => ({
                    ...prev,
                    location: {
                        ...prev.location as Location,
                        [locationField]: newLocationValue,
                    }
                }));
                break;
            case id === "description":
            case id === "instructorEmail":
                const newValue = value === '' ? null : value;
                setCourse(prev => ({
                    ...prev,
                    [id]: newValue,
                }));
                break;
            default:
                setCourse(prev => ({
                    ...prev,
                    [id]: value,
                }));
                break;
        }
    }

    const handlePDFChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileName = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    const splitResult = e.target.result.split(',');
                    if (splitResult.length > 1) {
                        const base64 = splitResult[1];
                        setCourse(prev => ({
                            ...prev,
                            hasPDF: true,
                            pdf: {
                                pdfId: 0,
                                courseId: 0,
                                fileName,
                                data: base64,
                            }
                        }));
                    } else {
                        setErrors(prev => ({
                            ...prev,
                            pdf: 'Invalid PDF',
                        }));
                        
                    }
                } else {
                    setErrors(prev => ({
                        ...prev,
                        pdf: 'Invalid PDF',
                    }));
                }
            }
            reader.readAsDataURL(file);
        }
    }
    
    const handleRemovePDF = () => {
        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }
        setErrors(prev => ({ ...prev, pdf: '' }));
        setCourse(prev => ({ ...prev, hasPDF: false, pdf: undefined }))
    }

    const handleValidation = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const formErrors: FormError = {};
        const { id, value } = e.target;

        switch (id) {
            case 'title':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'Title must be between 3 and 50 characters';   
                break;
            case 'description':
                formErrors[id] = value === '' ? '' : validateLength(value, 10, 500) ? '' : 'Description must be between 10 and 500 characters';
                break;
            case 'maxAttendance':
                formErrors[id] = parseInt(value) > 0 ? '' : 'Max Attendance must be greater than 0';
                break;
            case 'attendanceCredit':
                formErrors[id] = parseInt(value) > 0 ? '' : 'Attendance Credit must be greater than 0';
                break;
            case 'enrollmentDeadline':
                formErrors[id] = archivable ? '' : new Date(value) > new Date() ? '' : 'Enrollment Deadline must be in the future';
                break;
            case 'examCredit':
                formErrors[id] = course.hasExam && (parseInt(value) > 0) ? '' : 'Exam Credit must be greater than 0';
                break;
            case 'instructorName':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'Instructor Name must be between 3 and 50 characters';
                break;
            case 'instructorEmail':
                formErrors[id] = value === '' ? '' : validateEmail(value)
                break;
            case 'location.description':
                formErrors[id] = value === '' ? '' : validateLength(value, 10, 100) ? '' : 'Location Description must be between 10 and 100 characters';
                break;
            case 'location.room':
                formErrors[id] = value === '' ? '' : validateLength(value, 0, 30) ? '' : 'Room must be less than 30 characters';
                break;
            case 'location.remoteLink':
                formErrors[id] = value === '' ? '' : validateURL(value)
                break;
            case 'location.addressLine1':
                formErrors[id] = value === '' ? '' : validateLength(value, 5, 50) ? '' : 'Address Line 1 must be between 5 and 50 characters';
                break;
            case 'location.addressLine2':
                formErrors[id] = value === '' ? '' : validateLength(value, 0, 50) ? '' : 'Address Line 2 must be between 0 and 50 characters';
                break;
            case 'location.city':
                formErrors[id] = value === '' ? '' : validateLength(value, 3, 50) ? '' : 'City must be between 3 and 50 characters';
                break;
            case 'location.postalCode':
                formErrors[id] = value === '' ? '' : validateZip(value)
                break;
        }

        setErrors(prev => ({
            ...prev,
            [id]: formErrors[id],
        }))
    }

    const requiredFieldsFilled = (): boolean => {
        const { title, instructorName, maxAttendance, attendanceCredit, enrollmentDeadline, hasExam, examCredit } = course;
        if (title === '' || instructorName === '' || maxAttendance === 0 || attendanceCredit === 0 || enrollmentDeadline === null) {
            return false;
        }

        if(hasExam && examCredit === null && examCredit === 0) {
            return false;
        }

        return true;
    }

    const updateCourseStatus = () => {
        if (course.classes.length > 0 && 
            course.status !==  'Cancelled' && 
            course.status !== 'Archived') {
            const today = new Date();
            const firstClass = new Date(course.classes[0].date);
            const lastClass = new Date(course.classes[course.classes.length - 1].date);
        

            if (today >= firstClass && today <= lastClass) {
                setCourse(prev => ({
                    ...prev,
                    status: 'InProgress',
                }));
            } else if (today > lastClass) {
                setCourse(prev => ({
                    ...prev,
                    status: 'Completed',
                }));
            } else {
                setCourse(prev => ({
                    ...prev,
                    status: 'UpComing',
                }));
            }
        }
    }

    return (
        <form onSubmit={handleOnSubmit} className="max-w-2xl space-y-2">
            <div className="border-b p-2">
                <h1 className="text-xl font-bold">Course Information</h1>
            </div>
            <TextInput
                label="Title"
                id="title"
                placeholder="Ubran Renewal"
                defaultValue={course.title}
                onBlur={handleValidation}
                onChange={handleOnChange}
                error={errors.title}
                required
            />
            <TextAreaInput
                id="description"
                placeholder="Course description..."
                value={course.description || ''}
                onBlur={handleValidation}
                onChange={handleOnChange}
                error={errors.description}
            />
            <div className="sm:flex sm:gap-2 sm:items-baseline space-y-2">
                <div className="sm:w-1/2">
                    <NumberInput
                        label="Max Attendance"
                        id="maxAttendance"
                        value={course.maxAttendance}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                        error={errors.maxAttendance}
                        required
                    />
                </div>
                <div className="sm:w-1/2">
                   <NumberInput
                        label="Attendance Credit"
                        id="attendanceCredit"
                        value={course.attendanceCredit}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                        error={errors.attendanceCredit}
                        required
                    />
                </div>
            </div>
            <div className="sm:flex">
                <div className="sm:w-1/2 sm:pr-1">
                    <DateInput
                        label="Enrollment Deadline"
                        id="enrollmentDeadline"
                        value={course.enrollmentDeadline}
                        onChange={handleOnChange}
                        onBlur={handleValidation}
                        error={errors.enrollmentDeadline}
                        required
                    />
                </div>
                <div className="sm:flex sm:justify-between sm:w-1/2 gap-2">
                    <div className="w-1/2 sm:flex sm:items-center sm:gap-4 space-y-2">
                            <p>Has Exam?</p>
                            <input 
                                id="hasExam"
                                type="checkbox" 
                                className="toggle toggle-info"
                                value={course.hasExam.toString()}
                                onChange={handleOnChange}
                            />
                    </div>
                    {course.hasExam && (
                        <div className="sm:w-1/2">
                            <NumberInput
                                label="Exam Credit"
                                id="examCredit"
                                value={course.examCredit || 0}   
                                onBlur={handleValidation}
                                onChange={handleOnChange}
                                error={errors.examCredit}
                                required
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="border-b p-2">
                <h1 className="text-xl font-bold">Instructor</h1>
            </div>
            <div className="sm:flex sm:gap-2">
            <div className="sm:w-1/2">
                <TextInput
                    label="Name"
                    id="instructorName"
                    placeholder="John Doe"
                    defaultValue={course.instructorName}
                    onBlur={handleValidation}
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className="sm:w-1/2">
                <EmailInput
                    id="instructorEmail"
                    placeholder="Some@Example.com"
                    defaultValue={course.instructorEmail || ''}
                    onBlur={handleValidation}
                    onChange={handleOnChange}
                    error={errors.instructorEmail}
                />
            </div>
            </div>
            <div className="border-b p-2">
                <h1 className="text-xl font-bold">Location</h1>
            </div>
            <TextInput
                label="Description"
                id="location.description"
                placeholder="Jefferson County Courthouse..."
                defaultValue={course.location?.description || ''}
                onBlur={handleValidation}
                onChange={handleOnChange}
            />
            <div className="sm:flex sm:gap-2 items-baseline space-y-2">
                <div className="sm:w-1/2">
                    <TextInput
                        label="Room"
                        id="location.room"
                        placeholder="4B"
                        defaultValue={course.location?.room || ''}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="sm:w-1/2">
                    <TextInput
                        label="Link"
                        id="location.remoteLink"
                        placeholder="https://example.com"
                        defaultValue={course.location?.remoteLink || ''}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                        error={errors['location.remoteLink']}
                    />
                </div>
            </div>
            <TextInput
                label="Address Line 1"
                id="location.addressLine1"
                placeholder="123 Main St"
                defaultValue={course.location?.addressLine1 || ''}
                onBlur={handleValidation}
                onChange={handleOnChange}
            />
            <TextInput
                label="Address Line 2"
                id="location.addressLine2"
                placeholder="Suite 101"
                defaultValue={course.location?.addressLine2 || ''}
                onBlur={handleValidation}
                onChange={handleOnChange}
            />
            <div className="sm:flex sm:gap-2 sm:items-baseline space-y-2">
                <div className="sm:w-1/3">
                    <TextInput
                        label="City"
                        id="location.city"
                        placeholder="Boise"
                        defaultValue={course.location?.city || ''}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="sm:w-1/3">
                    <SelectInput
                        id="location.state"
                        value={course.location?.state || ''}
                        onChange={handleOnChange}
                        options={states}
                    />
                </div>
                <div className="sm:w-1/3">
                    <TextInput
                        label="Zip"
                        id="location.postalCode"
                        placeholder="83702"
                        defaultValue={course.location?.postalCode || ''}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                        onInput={handleIntInput}
                        error={errors['location.postalCode']}
                    />
                </div>
            </div>
            <div className="border-b p-2">
                <h1 className="text-xl font-bold">PDF</h1>
            </div>
            <div className="sm:flex sm:justify-between items-end space-y-2">
                {!course.hasPDF ? (
                    <div>
                        <input
                            type="file"
                            accept=".pdf"
                            className="file-input file-input-bordered w-full"
                            id="pdf"
                            ref={pdfInputRef}
                            onChange={handlePDFChange}
                        />
                        {errors.pdf && <p className="text-error">{errors.pdf}</p>}
                    </div>
                ) : (
                    <a 
                        className="link link-info text-xl" 
                        href={`data:application/pdf;base64,${course.pdf?.data}`} 
                        download={course.pdf?.fileName}>
                            {course.pdf?.fileName}
                    </a>
                )}
                <button
                    className="btn btn-error dark:text-white"
                    onClick={handleRemovePDF}
                >
                    Remove
                </button>
            </div>
            {goBack && (
                <div className="border-b p-2"/>
            )}
            <div className="flex justify-end gap-2">
                {goBack && (
                    <button
                        className="btn btn-error dark:text-white"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </button>
                )}
                {onSubmit && (
                    <button
                        type="submit"
                        className="btn btn-success dark:text-white"
                        disabled={!isFormValid}
                    >
                        {submitText}
                    </button>
                )}
            </div>
        </form>
    );
};

export default CourseForm;


