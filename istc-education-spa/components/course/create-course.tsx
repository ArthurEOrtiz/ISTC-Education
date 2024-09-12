'use client';
import { postCourse } from "@/utils/api/courses";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { useRouter } from "next/navigation";

const CreateCourse: React.FC = () => {
    const [ course, setCourse ] = useState<Course | null>(null);
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

    return (
        <>
            <div className="lg:w-2/3 border border-info rounded-md p-4">
                {/* <CourseForm
                    submitText="Create Course"
                    course={course || undefined}
                    onSubmit={(course) => setCourse(course)}

                /> */}
            </div>
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
                    <ErrorBody error={errors} />
                </ModalBase>
            )}
        </>
    );
}

export default CreateCourse;
