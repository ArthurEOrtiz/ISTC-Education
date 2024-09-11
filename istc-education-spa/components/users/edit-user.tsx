'use client';
import UserForm from "./user-form";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import { putUser } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import ErrorBody from "../modal/error-body";

interface EditUserProps {
    user: User;
}

export const EditUser: React.FC<EditUserProps> = ({ user }) => {
    const [ errors, setErrors ] = useState<string | ErrorResponse | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (user: User) => {
        setIsSubmitting(true);
        try {
            const response = await putUser(user);
            if (response.success) {
                router.push('/user');
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
            <div className="lg:w-2/3 border border-info rounded-md p-4">
                <UserForm
                    user={user}
                    submitText="Update User"
                    goBack={true}   
                    onSubmit={handleSubmit}
                    onError={setErrors}
                />
            </div>
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