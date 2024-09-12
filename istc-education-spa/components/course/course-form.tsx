'use client';
import { ChangeEvent, useEffect, useState } from "react";
import TextInput from "../form/text-input";
import { validateLength } from "@/utils/forms/validation";
import { useRouter } from "next/navigation";
import TextAreaInput from "../form/textarea-input";
import DateInput from "../form/date-input";
import NumberInput from "../form/number-input";
import EmailInput from "../form/email-input";

interface CourseFormProps {
    course?: Course;
    submitText?: string;
    goBack?: boolean;
    onSubmit: (course: Course) => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course: incomingCourse,submitText="Submit", goBack = false, onSubmit }) => {
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };

    const [ course, setCourse ] = useState<Course>({
        courseId:  0,
        status: "UpComing",
        title: "",
        description: null,
        attendanceCredit: 0,
        maxAttendance: 0,
        enrollmentDeadline: getTomorrowDate(),
        instructorName: "",
        instructorEmail: "",
        hasExam: false,
        examCredit: null,
        hasPDF: false,
        location: null,
        pdf: null,
        topics: null,
        exams: null,
        classes: null,
        waitList: null,
    });
    const [ errors, setErrors ] = useState<FormError>({}); 
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (incomingCourse) {
            setCourse(incomingCourse);
        }
    }, [incomingCourse]);

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(course);
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        switch (true) {
            case id === "maxAttendance" || id === "attendanceCredit":
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
            default:
                setCourse(prev => ({
                    ...prev,
                    [id]: value,
                }));
        }
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
                formErrors[id] = value === '' ? 'Enrollment Deadline is required' : new Date(value) > new Date() ? '' : 'Enrollment Deadline must be in the future';
                break;
            case 'examCredit':
                formErrors[id] = course.hasExam && (parseInt(value) > 0) ? '' : 'Exam Credit must be greater than 0';
                break;
            case 'instructorName':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'Instructor Name must be between 3 and 50 characters';
            default:
        }

        setErrors(prev => ({
            ...prev,
            [id]: formErrors[id],
        }))
   }

    return (
        <form onSubmit={handleOnSubmit} className="max-w-2xl space-y-2">
            <TextInput
                label="Title"
                id="title"
                placeholder="Underwater Basket Weaving"
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
                        value={new Date(course.enrollmentDeadline).toISOString().split('T')[0]}
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
            <div className="sm:flex sm:gap-2 sm:items-baseline space-y-2">
                <div className="sm:w-1/2">
                    <TextInput
                        label="Instructor Name"
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
                        label="Instructor Email"
                        id="instructorEmail"
                        placeholder="Some@Example.com"
                        defaultValue={course.instructorEmail || ''}
                        onBlur={handleValidation}
                        onChange={handleOnChange}
                 
                    />
                </div>
            </div>
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
    );
};

export default CourseForm;


