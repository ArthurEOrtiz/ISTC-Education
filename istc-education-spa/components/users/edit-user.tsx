'use client';
import UserForm from "./user-form";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import { putUser } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import ErrorBody from "../modal/error-body";

interface EditUserProps {
    user: User;
    isAdmin?: boolean;   
}

export const EditUser: React.FC<EditUserProps> = ({ user, isAdmin = false }) => {
    const [ errors, setErrors ] = useState<string | ErrorResponse | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
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

    if (isSubmitting) {
        return  (
            <>            
                <p className="text-3xl font-bold">Updating User...</p>
                <span className="loading loading-spinner loading-lg"></span>
            </>
        )
    }

    return (
        <>
            <div className="border border-info rounded-md p-2">
                <UserForm
                    user={user}
                    submitText="Update User"
                    goBack={true}   
                    onSubmit={handleSubmit}
                    onError={setErrors}
                />
            </div>
            {success && (
                <ModalBase
                    title="Success"
                    width="w-1/2"
                    isOpen={success}
                    onClose={() => {}}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">User Updated Successfully</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => router.push('/dashboard')}
                            >
                                Go to Dashboard
                            </button>
                            {isAdmin && (
                                <button
                                    className="btn btn-info dark:text-white"
                                    onClick={() => router.push('/admin')}
                                >
                                    Go to Admin Dashboard
                                </button>
                            )}
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