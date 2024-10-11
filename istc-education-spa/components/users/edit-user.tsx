'use client';
import UserForm from "./user-form";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import { putUser } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import ErrorBody from "../modal/error-body";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import EditUserCertifications from "../certification/edit-user-certifications";

interface EditUserProps {
    user: User;
    isAdmin?: boolean;   
}

export const EditUser: React.FC<EditUserProps> = ({ user: incomingUser, isAdmin = false }) => {
    const [ user, setUser ] = useState<User>(incomingUser);
    const [ infoExpanded, setInfoExpanded ] = useState<boolean>(true);
    const [ errors, setErrors ] = useState<string | ErrorResponse | null>(null);
    const [ certificationExpanded, setCertificationExpanded] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ archiveConfirmationModal, setArchiveConfirmationModal ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (user: User) => {
        setIsSubmitting(true);
        try {
            const response = await putUser(user);
            if (response.success) {
                setSuccess(true);
            } else {
                setErrors(response.error ?? "An unknown error occurred");
            }
        } catch (error) {
            setErrors("An error occurred while updating the user");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleArchive = () => {
        setArchiveConfirmationModal(false);
        setUser({ ...user, status: "Archived" });
    }

    return (
        <>
            <div className="w-full max-w-2xl space-y-2">
                <div className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold">Information</h2>
                    <button
                        className="btn btn-ghost btn-circle text-3xl"
                        onClick={() => setInfoExpanded(!infoExpanded)}
                    >
                        {infoExpanded ? <FaAngleUp />: <FaAngleDown /> }
                    </button>
                </div>

                {infoExpanded && (
                    <UserForm
                        user={user}
                        setUser={setUser}
                        submitText="Update User"
                        submitting={isSubmitting}
                        goBack={!isAdmin}
                        onSubmit={isAdmin ? undefined : handleSubmit}
                        onError={setErrors}
                    />
                )}

                {isAdmin && (
                    <>
                        <div className="w-full flex justify-between">
                            <h2 className="text-2xl font-bold">Certifications</h2>
                            <button
                                className="btn btn-ghost btn-circle text-3xl"
                                onClick={() => setCertificationExpanded(!certificationExpanded)}
                            >
                                {certificationExpanded ? <FaAngleUp />: <FaAngleDown /> }
                            </button>
                        </div>

                        {certificationExpanded && (
                            <EditUserCertifications user={user} setUser={setUser} />
                        )}
                                
                        <div className="flex gap-2">
                            <p className="text-lg">Status:</p>
                            <p className="text-lg font-semibold">{user.status}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="btn btn-info"
                                onClick={() => router.back()}
                            >
                                Back
                            </button>

                            <div className="flex gap-2">
                                <button
                                    className="btn btn-error text-white"
                                    onClick={() => setArchiveConfirmationModal(true)}
                                >
                                    Archive
                                </button>

                                <button
                                    className="btn btn-success text-white"
                                    onClick={() => handleSubmit(user)}
                                >
                                    {isSubmitting ? <span className="loading loading-spinner"></span>: "Update User"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {success && (
                <ModalBase
                    title="Success"
                    width="w-1/2"
                    isOpen={success}
                    onClose={() => setSuccess(false)}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">User Updated Successfully</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-success text-white"
                                onClick={() => router.push('/dashboard')}
                            >
                                Go to Dashboard
                            </button>
                            {isAdmin && (
                                <button
                                    className="btn btn-info text-white"
                                    onClick={() => router.push('/admin')}
                                >
                                    Go to Admin Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </ModalBase>
            )}
            {archiveConfirmationModal && (
                <ModalBase
                    title="Archive User"
                    width="w-1/2"
                    isOpen={archiveConfirmationModal}
                    onClose={() => setArchiveConfirmationModal(false)}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Are you sure you want to archive this user?</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-error dark:text-white"
                                onClick={handleArchive}
                            >
                                Archive
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={() => setArchiveConfirmationModal(false)}
                            >
                                Cancel
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
    );
}