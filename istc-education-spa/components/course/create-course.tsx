'use client';
import { postCourse } from "@/utils/api/courses";
import { useEffect, useState } from "react";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { useRouter } from "next/navigation";
import CourseForm from "./course-form";
import CourseInfo from "./course-info";
import AddRemoveClass from "./course-add-remove-class";
import AddRemoveTopics from "./course-add-remove-topic";

const CreateCourse: React.FC = () => {
    const getTomorrowDate = (): string => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    const [ course, setCourse ] = useState<Course>({
        courseId: 0,
        status: 'UpComing',
        title: '',
        description: null,
        attendanceCredit: 0,
        maxAttendance: 0,
        enrollmentDeadline: getTomorrowDate(),
        instructorName: '',
        instructorEmail: null,
        hasExam: false,
        examCredit: null,
        hasPDF: false,
        location: {
            locationId: 0,
            description: null,
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: 'Idaho',
            postalCode: null,
        } as Location,
        classes: [],
    } as Course);
    const [ step, setStep ] = useState<number>(1);
    const [ isCourseValid, setIsCourseValid ] = useState<boolean>(false);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsCourseValid(course.classes.length > 0);
        updateCourseStatus();
    }, [course.classes]);

    const createCourse = async () => {
        setSaving(true);
        try {
            const response = await postCourse(course);
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error ?? "An unknown error occurred.");
            }
        } catch (error) {
            setError("An error occurred while creating the course.");
        } finally {
            setSaving(false);
        }
    }

    const handleCourseFormSubmit = () => {
        setStep(2);
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
        <>
            {step === 1 && (   
                <div className="border border-info rounded-md p-4">
                    <CourseForm
                        submitText="Next"
                        goBack
                        course={course}
                        setCourse={setCourse}
                        onSubmit={handleCourseFormSubmit}
                    />
                </div>
            )}
            {step === 2 && (
                <div className="sm:w-2/3 flex flex-col items-center p-2 space-y-2">
                    <CourseInfo course={course} expanded />
                    <div className="max-w-3xl w-full space-y-2">
                        <div className="border border-info rounded-md p-4">
                            <h2 className="text-2xl font-bold">Topics</h2>
                            <div className="border-b p-2" />
                            <AddRemoveTopics course={course} setCourse={setCourse} />
                        </div>
                        <div className="border border-info rounded-md p-4">
                            <h2 className="text-2xl font-bold">Classes</h2>
                            <div className="border-b p-2" />
                            <AddRemoveClass course={course} setCourse={setCourse} />
                        </div>
                        <div className="flex justify-end gap-2">

                            <button
                                className="btn btn-error dark:text-white"
                                onClick={() => setStep(1)}
                            >
                                Go Back
                            </button>

                           

                            <button
                                className="btn btn-success dark:text-white"
                                onClick={createCourse}
                                disabled={!isCourseValid}
                            >
                                {saving ? <span className="loading loading-spinner"></span> : "PostCourse"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {success && (
                <ModalBase
                    title="Success"
                    width="w-1/3"
                    isOpen={success}
                    onClose={() => {router.push('/course/edit')}}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Course Created Successfully!</h2>
                        <div className="flex justify-between">
                            <button
                                className="btn btn-info"
                                onClick={() => router.push('/admin')}
                            >
                                Admin Dashboard
                            </button>
                            <button
                                className="btn btn-info"
                                onClick={() => router.push('/course/edit')}
                            >
                                Back to Edit Courses
                            </button>
                        </div>
                    </div>
                </ModalBase>
            )}
            {errors && (
                <ModalBase
                    title="Error"
                    width="w-1/2"
                    isOpen={!!errors}
                    onClose={() => setError(null)}
                >
                    <ErrorBody errors={errors} />
                </ModalBase>
            )}
        </>
    );
}

export default CreateCourse;
