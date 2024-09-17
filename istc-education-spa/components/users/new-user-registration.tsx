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
    const [user, setUser] = useState<User>({
        userId: 0,
        ipId: IPId,
        status: "Active",
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
            appraiserCertified: false,
            mappingCertified: false,
        },
    } as User);
    const [ step, setStep ] = useState<number>(1);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const router = useRouter();

    const registerUser = async () => {
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

    return (
        <>
            <div className="w-full flex flex-col items-center space-y-2">
                <h1 className="text-3xl font-bold"> New User Registration </h1>
                <div className="lg:w-2/3 border border-info rounded-md p-4">
                    {step === 1 && (
                        <UserForm
                            user={user}
                            setUser={setUser}
                            submitText="Next"
                            onSubmit={(user) => {
                                setUser(user);
                                setStep(2);
                            }}
                            onError={(error) => setError(error)}
                        />
                    )}
                    {step === 2 && user && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Review User Information</h2>
                            <UserInfo user={user} />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className=" btn btn-error dark:text-white"
                                >
                                    Back
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
    