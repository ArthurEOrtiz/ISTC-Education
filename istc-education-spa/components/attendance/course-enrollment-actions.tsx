'use client';
import { addWaitQueue, isStudenEnrolled, removeWaitQueue } from "@/utils/api/student";
import { useEffect, useState } from "react";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";

interface CourseEnrollmentActionsProps {
    course: Course;
    student: Student | null;
}

const CourseEnrollmentActions: React.FC<CourseEnrollmentActionsProps> = ({ course, student }) => {
    const [ enrollmentStatus, setEnrollmentStatus ] = useState<"Enrolled" | "Waitlisted" | "Not Enrolled">("Not Enrolled");
    const [ buttonText, setButtonText ] = useState<"Apply" | "Drop">('Apply');
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ applying, setApplying ] = useState(false);
    const [ error, setError ] = useState<string | ErrorResponse | null>(null);
    const { courseId, status } = course;


    useEffect(() => {
        if (student) {
            isEnrolled().then((enrolled) => {
                if (enrolled) {
                    setEnrollmentStatus("Enrolled");
                    setButtonText("Drop");
                } else if (isStudentInAddQueue()) {
                    setEnrollmentStatus("Waitlisted");
                    setButtonText("Drop");
                }
            });
        }
        if (status !== 'UpComing' && status !== 'InProgress') {
            setButtonDisabled(true);
        }
    }, []);


    const isStudentInAddQueue = (): boolean => {
        if (!student) return false;
        return student.waitLists?.some(wl => wl.courseId === courseId) ?? false;
    };

    const isEnrolled = async (): Promise<boolean> => {
        if (!student) return false;
        return await isStudenEnrolled(courseId, student.studentId);
    }
       

    const handleApply = async () => {
        if (!student) return;
        setApplying(true);
        try {
            const isApplying = buttonText === 'Apply';
            const response = isApplying ? await addWaitQueue(courseId, student.studentId) : await removeWaitQueue(courseId, student.studentId);
            console.log(response);
            if (response.success) {
                setEnrollmentStatus(isApplying ? "Waitlisted" : "Not Enrolled");
                setButtonText(isApplying ? "Drop" : "Apply");
            } else {
                setError(response.error ?? "An unknown error occurred.");  
            }
        } catch (error) {
            setError("An error occurred while applying to the course.");
        } finally {
            setApplying(false);
        }
    }

    if(!student) {
        return null;
    }

    return (
        <>
            <div className="flex justify-end w-full">
                <p className="text-xl font-bold">{enrollmentStatus}</p>
            </div>
            <div className="flex justify-end w-full">
                <button 
                    className="btn btn-success dark:text-white"
                    disabled={applying || buttonDisabled}
                    onClick={handleApply}
                    >
                    {applying ? <span className="loading loading-spinner"></span> : buttonText}
                </button>
            </div>
            {error && (
                <ModalBase
                    title="Error"
                    width="w-1/2"
                    isOpen={!!error}
                    onClose={() => setError(null)}
                >
                    <ErrorBody errors={error} />
                </ModalBase>
            )}
        </>
    );
}

export default CourseEnrollmentActions;