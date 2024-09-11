'use client';
import { User } from "@/types/user";
import { postUser } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserForm from "./user-form";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import UserInfo from "./user-info";

const CreateUser: React.FC = () => {
    const [ user, setUser ] = useState<User | null>(null);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const [ previewUser, setPreviewUser ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const registerUser = async () => {
        if (user) {
            try {
                const response = await postUser(user);
                if (response.success) {
                    setSuccess(true);
                } else {
                    setError(response.error ?? "An unknown error occurred");
                }
            } catch (error) {
                setError("An error occurred while registering the user");
            } finally {
                setPreviewUser(false);
            }
        }
    }

    return (
        <>
            <div className="lg:w-2/3 border border-info rounded-md p-4">
                <UserForm
                    submitText="Next"
                    user={user || undefined}
                    onSubmit={(user) => {
                        setPreviewUser(true);
                        setUser(user)
                    }}
                    onError={(error) => setError(error)}
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
                        <h2 className="text-xl font-bold">User Registration Successful</h2>
                        <button
                            className="btn btn-success dark:text-white"
                            onClick={() => router.push('/admin')}
                        >
                            Go to Admin Dashboard
                        </button>
                    </div>
                </ModalBase>
            )}
            {previewUser && user && (
                <ModalBase
                    title="User Preview"
                    width="w-1/2"
                    isOpen={previewUser}
                    onClose={() => setPreviewUser(false)}
                >
                    <div className="space-y-2">
                        <UserInfo user={user} />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="btn btn-error dark:text-white"
                                onClick={() => setPreviewUser(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => registerUser()}
                            >
                                Register User
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
                    onClose={() => setError(null)}
                >
                    <ErrorBody errors={errors} />
                </ModalBase>
            )}
        </>
    );
}

export default CreateUser;

    