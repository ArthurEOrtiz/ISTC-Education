'use client';
import {  isStudenEnrolled, addWaitlist, removeWaitlist, dropStudent } from "@/utils/api/student";
import { useEffect, useState } from "react";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";

interface CourseEnrollmentActionsProps {
    course: Course;
    student: Student | null;
}

const CourseEnrollmentActions: React.FC<CourseEnrollmentActionsProps> = ({ course, student }) => {
    const [ enrollmentStatus, setEnrollmentStatus ] = useState<"Enrolled" | "Waitlisted" | "Not Enrolled" | "Error">("Not Enrolled");
    const [ buttonText, setButtonText ] = useState<"Apply" | "Drop">('Apply');
    const [ statusTextColor, setStatusTextColor ] = useState<"text-success" | "text-error"| "text-warning">("text-error");
    const [ confirmDropModal, setConfirmDropModal ] = useState<boolean>(false);
    const [ confirmationMessage, setConfirmationMessage ] = useState<string>("");   
    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | ErrorResponse | null>(null);
    const { courseId, status } = course;
    const { studentId } = student as Student;

    useEffect(() => {
        setLoading(true);
        isStudenEnrolled(courseId, studentId).then((enrolled) => {
            if (enrolled) {
                setEnrollmentStatus("Enrolled");
                setStatusTextColor("text-success");
                setButtonText("Drop");
            } else if (isStudentInWaitList()) {
                setEnrollmentStatus("Waitlisted");
                setStatusTextColor("text-warning");
                setButtonText("Drop");
            } else {
                setEnrollmentStatus("Not Enrolled");
                setStatusTextColor("text-error");
                setButtonText("Apply");
            }
        }).catch((error) => {
            setEnrollmentStatus("Error");
            setStatusTextColor("text-error");   
            setButtonDisabled(true);
            setError(error.message);
        }).finally(() => {
            setLoading(false);
        });



        if (status !== 'UpComing' && status !== 'InProgress') {
            setButtonDisabled(true);
        }
    }, []);

 

    const isStudentInWaitList = (): boolean => {
        if (!student) return false;
        return student.waitLists?.some(wl => wl.courseId === courseId) ?? false;
    };

    const handleApplyOnClick = () => {
        if (enrollmentStatus === "Enrolled" || enrollmentStatus === "Waitlisted") {
            setConfirmationMessage("Are you sure you want to drop this course?");
            setConfirmDropModal(true);
        } else {
            handleApply();
        }
    }  


    const handleApply = async () => {
        setLoading(true);
        switch (enrollmentStatus) {
            case "Enrolled":
                console.log("Dropping student", courseId, studentId);
                dropStudent(courseId, studentId).then((response) => {
                    if (response.success) {
                        setEnrollmentStatus("Not Enrolled");
                        setStatusTextColor("text-error");
                        setButtonText("Apply");
                    } else {
                        setError(response.error as string);
                    }
                }).catch((error) => {
                    setError(error.message);
                });
                break;
            case "Waitlisted":
                removeWaitlist(courseId, studentId).then((response) => {
                    if (response.success) {
                        setEnrollmentStatus("Not Enrolled");
                        setStatusTextColor("text-error");
                        setButtonText("Apply");
                    } else {
                        setError(response.error as string);
                    }
                }).catch((error) => {
                    setError(error.message);
                });
                break;
            case "Not Enrolled":
                addWaitlist(courseId, studentId).then((response) => {
                    if (response.success) {
                        setEnrollmentStatus("Waitlisted");
                        setStatusTextColor("text-warning");
                        setButtonText("Drop");
                    } else {
                        setError(response.error as string);
                    }
                }).catch((error) => {
                    setError(error.message);
                });
                break;
        }
        setLoading(false);
    }


    if(!student) {
        return null;
    }

    return (
        <>
            <div className="flex justify-end w-full gap-2">
                <p className="text-xl font-bold">Status:</p>
                <p className={`text-xl font-bold ${statusTextColor}`}>{enrollmentStatus}</p>
            </div>
            <div className="flex justify-end w-full">
                <button 
                    className="btn btn-success dark:text-white"
                    disabled={loading || buttonDisabled}
                    onClick={handleApplyOnClick}
                    >
                    {loading ? <span className="loading loading-spinner"></span> : buttonText}
                </button>
            </div>
            {confirmDropModal && (
                <ModalBase
                    title="Confirmation"
                    width="w-1/2"
                    isOpen={confirmDropModal}
                    onClose={() => setConfirmDropModal(false)}
                >
                    <p>{confirmationMessage}</p>
                    <div className="flex justify-end gap-2">
                        <button 
                            className="btn btn-error dark:text-white"
                            onClick={() => setConfirmDropModal(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn btn-success dark:text-white"
                            onClick={() => {
                                setConfirmDropModal(false);
                                handleApply();
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </ModalBase>
            )}
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