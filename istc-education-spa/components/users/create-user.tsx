'use client';
import { postUser } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserForm from "./user-form";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import UserInfo from "./user-info";

const CreateUser: React.FC = () => {
    const [user, setUser] = useState<User>({
        userId: 0,
        ipId: '',
        status: "AdminRegistered",
        firstName: '',
        lastName: '',
        middleName: null,
        isAdmin: false,
        isStudent: true,
        contact: {
            contactId: 0,
            userId: 0,
            email: '',
            phone: null,
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: 'Idaho',
            postalCode: null,
        },
        employer: {
            employerId: 0,
            userId: 0,
            employerName: 'Initial',
            jobTitle: '',
        },
        student: {
            studentId: 0,
            userId: 0,
            accumulatedCredits: 0,
            appraiserCertified: false,
            mappingCertified: false,
        },
    } as User);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ previewUser, setPreviewUser ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const registerUser = async () => {
        if (user) {
            try {
                setSaving(true);
                const response = await postUser(user);
                if (response.success) {
                    setSuccess(true);
                } else {
                    setError(response.error ?? "An unknown error occurred");
                }
            } catch (error) {
                setError("An error occurred while registering the user");
            } finally {
                setSaving(false);
                setPreviewUser(false);
            }
        }
    }

    return (
        <>
            <div className="border border-info rounded-md p-4">
                <UserForm
                    submitText="Next"
                    goBack
                    user={user}
                    setUser={setUser}
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
            {previewUser && (
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
                                {saving ? <span className="loading loading-spinner"></span> : "Submit"}
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

    