import NewUserRegistration from "@/components/users/new-user-registration";
import { User } from "@/types/user";
import { getUserByIpId } from "@/utils/api/users";
import { currentUser, User as ClerkUser } from "@clerk/nextjs/server";
import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";

const UserPage:React.FC = async () => {
    const clerkUser: ClerkUser | null = await currentUser()
        .catch((error) => { throw error });   

    if (!clerkUser) {
        return notFound(); 
    }

    const ipId: string | undefined = clerkUser.id;

    const serverUser: User | null = ipId ? await getUserByIpId(ipId).catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }) : null;

    if (serverUser === null && ipId) {
        return <NewUserRegistration IPId={ipId} />;
    }


    const { contact, employer } = serverUser || {};

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Dashboard </h1>
            <div className="w-2/3 space-y-2">
                {serverUser && clerkUser && (
                    <div className="border border-info rounded-md p-4 space-y-2">
                        <h2 className="text-xl font-bold">{serverUser.firstName} {serverUser.middleName} {serverUser.lastName}</h2>
                        <p className="text-sm">User Id: {serverUser.userId}</p>
                        <div className="flex justify-between gap-2">
                            {contact && (
                                <div className="w-1/2 border border-info rounded-md p-4">
                                    <h3 className="text-lg font-bold">Contact</h3>
                                    <p>{contact.email}</p>
                                    <p>{contact.phone}</p>
                                    <p>{contact.addressLine1}</p>
                                    <p>{contact.addressLine2}</p>
                                    <p>{contact.city}, {contact.state} {contact.postalCode}</p>
                                </div>
                            )}
                           {employer && (
                                <div className="w-1/2 border border-info rounded-md p-4">
                                    <h3 className="text-lg font-bold">Employer</h3>
                                    <p>{employer.employerName}</p>
                                    <p>{employer.jobTitle}</p>
                                </div>
                            )}
                        </div>

                        <div className="w-full border border-info rounded-md p-4">
                            <div className="flex justify-end">
                                <Link 
                                    href={`/user/edit/${serverUser.userId}`}
                                    className="btn btn-warning dark:text-white">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                {clerkUser &&
                    <div className="h-96 p-4 border border-info rounded-md overflow-auto">
                        <h2 className="text-xl font-bold">Clerk User</h2>
                        <pre>{JSON.stringify(clerkUser, null, 2)}</pre>
                    </div>
                }
                {serverUser &&
                    <div className="h-96 p-4 border border-info rounded-md overflow-auto">
                        <h2 className="text-xl font-bold">Server User</h2>
                        <pre>{JSON.stringify(serverUser, null, 2)}</pre>
                    </div>
                }

            </div>
        </div>
    );
}
export default UserPage;