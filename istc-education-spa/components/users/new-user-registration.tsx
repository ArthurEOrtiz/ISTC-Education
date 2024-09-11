'use client';
import { useState } from "react";
import UserForm from "./user-form";
import UserInfo from "./user-info";
import { postUser } from "@/utils/api/users";
import ModalBase from "../modal/modal-base";
import { useRouter } from "next/navigation";
import ErrorBody from "../modal/error-body";

interface NewUserRegistrationProps {
    IPId: string;
}

const NewUserRegistration: React.FC<NewUserRegistrationProps> = ({ IPId }) => {
    const [ user, setUser ] = useState<User | null>(null);
    const [ step, setStep ] = useState<number>(1);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const router = useRouter();

    const registerUser = async () => {
        if (user) {
            try {
                const response = await postUser(user);
                if (response.success) {
                    router.refresh();
                } else {
                    setError(response.error ?? "An unknown error occurred");
                }
            } catch (error) {
                setError("An error occurred while registering the user");
            }
        }
    }

    return (
        <>
            <div className="w-full flex flex-col items-center space-y-2">
                <h1 className="text-3xl font-bold"> New User Registration </h1>
                <div className="lg:w-2/3 border border-info rounded-md p-4">
                    {step === 1 && (
                        <>
                            {user === null ? (
                                <UserForm
                                    IPId={IPId}
                                    submitText="Next"
                                    onSubmit={(user) => {
                                        setUser(user);
                                        setStep(2);
                                    }}
                                    onError={(error) => setError(error)}
                                />
                            ) : (
                                <UserForm
                                    user={user}
                                    submitText="Next"
                                    onSubmit={(user) => {
                                        setUser(user);
                                        setStep(2);
                                    }}
                                    onError={(error) => setError(error)}
                                />
                            )}
                        </>
                    )}
                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Review User Information</h2>
                            
                            {user && <UserInfo user={user} />}

                            {/* <div className="border border-primary rounded-md p-4">
                                <pre>{JSON.stringify(user, null, 2)}</pre>
                            </div> */}

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className=" btn btn-warning  dark:text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={registerUser}
                                    className="btn btn-success dark:text-white"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {errors && (
                <ModalBase
                    title="Error"
                    isOpen={errors !== null}
                    onClose={() => setError(null)}
                >
                    <ErrorBody errors={errors} />
                </ModalBase>
            )}
        </>
     
    );

}

export default NewUserRegistration;
    