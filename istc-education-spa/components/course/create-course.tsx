'use client';
import { postCourse } from "@/utils/api/courses";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { useRouter } from "next/navigation";
import CourseForm from "./course-form";
import CourseInfo from "./course-info";
import { FaPlus } from "react-icons/fa";
import AddRemoveClass from "./course-add-remove-class";

const CreateCourse: React.FC = () => {
    const [ course, setCourse ] = useState<Course | null>(null);
    const [ step, setStep ] = useState<number>(1);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const createCourse = async () => {
        if (course) {
            try {
                const response = await postCourse(course);
                if (response.success) {
                    setSuccess(true);
                } else {
                    setError(response.error ?? "An unknown error occurred");
                }
            } catch (error) {
                setError("An error occurred while creating the course");
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
                        submitText="Create Course"
                        goBack
                        course={course || undefined}
                        onSubmit={handleCourseFormSubmit}
                    />
                </div>
            )}
            {step === 2 && course && (
                <div className="border border-info rounded-md p-4 space-y-2">
                    <CourseInfo course={course} expanded />
                    <div className="border border-info rounded-md p-4">
                        <h2 className="text-2xl font-bold">Classes</h2>
                        <div className="border-b p-2" />
                        <AddRemoveClass course={course} setCourse={setCourse} />
                    </div>
                    <div className="flex justify-between">

                        <button
                            className="btn btn-error dark:text-white"
                            onClick={() => setStep(1)}
                        >
                            Go Back
                        </button>

                        <button
                            className="btn btn-error dark:text-white"
                            onClick={() => setCourse({ ...course, classes: [] })}
                        >
                            Reset classes
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
                        >
                            Create Course
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
                        <button
                            className="btn btn-success dark:text-white"
                            onClick={() => router.push('/admin')}
                        >
                            Go to Admin Dashboard
                        </button>
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
