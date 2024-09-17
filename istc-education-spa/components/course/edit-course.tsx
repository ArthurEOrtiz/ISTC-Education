'use client';
import { useState } from "react";
import CourseForm from "./course-form";
import AddRemoveClass from "./course-add-remove-class";
import AddRemoveTopics from "./course-add-remove-topic";
import { useRouter } from "next/navigation";
import { putCourse } from "@/utils/api/courses";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";

interface EditCourseProps {
    course: Course;
}

const EditCourse: React.FC<EditCourseProps> = ({ course:incomingCourse }) => {
    const [ course, setCourse ] = useState<Course>(incomingCourse);
    const [ errors, setErrors ] = useState<string | ErrorResponse | null>(null);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const handleUpdateCourse = async () => {
        setSaving(true);
        try {
            const response = await putCourse(course);
            if (response.success) {
                setSuccess(true);
            } else {
                setErrors(response.error ?? "An unknown error occurred");
            }
        } catch (error) {
            setErrors("An error occurred while updating the course");
        } finally {
            setSaving(false);
        }
    }


    return(
        <>
            <div className="flex flex-col items-center">
                <CourseForm
                    course={course}
                    setCourse={setCourse}
                    submitText="Update Information"
                />
                <div className="w-full max-w-2xl space-y-2">
                    <h2 className="text-xl font-bold">Topics</h2>
                    <div className="border-b" />
                    <AddRemoveTopics course={course} setCourse={setCourse} />
                </div>
                <div className="w-full max-w-2xl space-y-2">
                    <h2 className="text-xl font-bold">Classes</h2>
                    <div className="border-b" />
                    <AddRemoveClass course={course} setCourse={setCourse} />
                </div>
                <div className="w-full border-b my-2" />
                <div className="w-full flex justify-end gap-2">
                    <button 
                        className="btn btn-error dark:text-white"
                        onClick={() => router.back()}>
                            Back
                    </button>
                    <button 
                        className="btn btn-success dark:text-white"
                        onClick={handleUpdateCourse}
                        disabled={saving}
                        >
                            {saving ? <span className="loading loading-spinner"></span> : "Update Course"}
                    </button>
                    
                </div>
            </div>
            {success && (
                <ModalBase
                    title="Success"
                    width="w-1/2"
                    isOpen={success}
                    onClose={() => setSuccess(false)}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Course Updated Successfully</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => router.push('/course')}
                            >
                                Go to Courses
                            </button>
                            <button
                                className="btn btn-info dark:text-white"
                                onClick={() => router.push('/admin')}
                            >
                                Go to Admin Dashboard
                            </button>
                        </div>
                    </div>
                </ModalBase>
            )}
            {errors && (
                <ModalBase
                    title="Error"
                    width="w-1/2"
                    isOpen={errors !== null}
                    onClose={() => setErrors(null)}
                >
                    <ErrorBody errors={errors} />
                </ModalBase>
            )}
        </>
    )
}

export default EditCourse;