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
    const [ course, setCourse ] = useState<Course | null>(null);
    const [ step, setStep ] = useState<number>(1);
    const [ isCourseValid, setIsCourseValid ] = useState<boolean>(false);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsCourseValid(!!course && course.classes.length > 0);
    }, [course?.classes]);

    const createCourse = async () => {
        if (course) {
            setSaving(true);
            try {
                const response = await postCourse(course);
                if (response.success) {
                    setSuccess(true);
                } else {
                    setError(response.error ?? "An unknown error occurred");
                }
            } catch (error) {
                setError("An error occurred while creating the course");
            } finally {
                setSaving(false);
            }
        }
    }

    const handleCourseFormSubmit = (course: Course) => {
        setCourse(course);
        setStep(2);
    }

    return (
        <>
            {step === 1 && (   
                <div className="border border-info rounded-md p-4">
                    <CourseForm
                        submitText="Next"
                        goBack
                        course={course || undefined}
                        onSubmit={handleCourseFormSubmit}
                    />
                </div>
            )}
            {step === 2 && course && (
                <div className="border border-info rounded-md sm:w-2/3 p-2 space-y-2">
                    <CourseInfo course={course} expanded />
                    <div className="border border-info rounded-md p-4">
                        <h2 className="text-2xl font-bold">Topics</h2>
                        <div className="border-b p-2" />
                        <AddRemoveTopics course={course} setCourse={setCourse} />
                    </div>
                    <div className="border border-info rounded-md p-4">
                        <h2 className="text-2xl font-bold">Classes</h2>
                        <div className="border-b p-2" />
                        <AddRemoveClass course={course} setCourse={setCourse as any} />
                    </div>
                    <div className="flex justify-between p-4">

                        <button
                            className="btn btn-error dark:text-white"
                            onClick={() => setStep(1)}
                        >
                            Go Back
                        </button>

                        <button
                            className="btn btn-success dark:text-white"
                            onClick={() => console.log(course)}
                        >
                            Log Course
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
            )}
            {success && (
                <ModalBase
                    title="Success"
                    width="w-1/2"
                    isOpen={success}
                    onClose={() => {}}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Course Created Successfully</h2>
                        <div className="flex justify-between">
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => router.push('/admin')}
                            >
                                Go to Admin Dashboard
                            </button>
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => router.push('/course')}
                            >
                                Go to Courses
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
