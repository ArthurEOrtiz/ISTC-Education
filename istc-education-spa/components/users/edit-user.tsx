'use client';
import { User } from "@/types/user";
import UserForm from "./user-form";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import { putUser } from "@/utils/api/users";
import { useRouter } from "next/navigation";


interface EditUserProps {
    user: User;
}

export const EditUser: React.FC<EditUserProps> = ({ user }) => {
    const [ error, setError ] = useState<string | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (user: User) => {
        setIsSubmitting(true);
        await putUser(user).then(() => {
            router.push('/user');
        }).catch((error) => {
            setIsSubmitting(false);
            setError(error.message);
        });
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
                    onError={setError}
                />
            </div>
            {error && (
                <ModalBase
                    title="Error"
                    isOpen={error !== null}
                    onClose={() => setError(null)}
                >
                    <p>{error}</p>
                </ModalBase>
            )}
        </>
    );
}