import NewUserRegistration from "@/components/users/new-user-registration";
import { getUserByEmail, isUserAdmin, putUser } from "@/utils/api/users";
import { currentUser, User as ClerkUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const DashboardPage:React.FC = async () => {
    /*
    * This is the dashboard for the user.
    * It will display the user's information and allow them to edit it.
    * User are redirected to this page after they login. So we need to chack
    * if the user is new or not. If they are new, and an admin has not signed 
    * them up they will be redirected to the new user registration page. If an 
    * admin has signed them up, the page should be the same as if they were a
    * returning user, except with a message that they are a new user.
    */

    // First we need to get the current user from the clerk client
    const clerkUser: ClerkUser | null = await currentUser();

    // If the user is not found, we will return a 404 page
    if (!clerkUser) {
        return notFound(); 
    }

    // First we pull Clerk's user ID and primary email address
    // NOTE: ipID is the Identity Provider ID
    const IPId: string = clerkUser.id;
    const { primaryEmailAddress } = clerkUser

    // If the user does not have a primary email address, we throw an error
    // NOTE: This should never happen, but if it does, we need to know about it.
    //       Errors on sever pages will be redirected to the error page(error boundary).
    if (!primaryEmailAddress) {
        throw new Error('User does not have a primary email address, please contact support');
    }

    const { emailAddress } = primaryEmailAddress;

    // Next we get the user from the server, using the primary email address
    // If the user is not found by email address then we know that the use is new
    // and has not been pre-registered by an admin. In this case we will redirect
    // the user to the new user registration page.
    const serverUser: User | null = await getUserByEmail(emailAddress);

    if (serverUser === null) {
        return <NewUserRegistration IPId={IPId} />;
    }

    // If the user is found, first we need to check if the user's IP ID matches the
    // the IP ID from the clerk client. If they do not match, we throw an error.
    // NOTE: This should never happen, but if it does, we need to know about it.
    if (serverUser.ipId && serverUser.ipId !== IPId) {
        throw new Error("Identity Provider ID does not match the user record");
    }

    // Then we need to check if the user was pre-registered by an admin or not.
    // A user that can be found by email address, but does not have an ipId is
    // a user that was pre-registered by an admin. If the user does have an ipId
    // then they are a returning user.
    const isUserNew: boolean = !serverUser.ipId;

    if (isUserNew) {
        // If the user is new, we need to update the user record with the IP ID from the clerk client.
        serverUser.ipId = IPId;
        serverUser.status = "Active";
        const response = await putUser(serverUser);
        if (!response.success) {
            throw new Error("Error updating user record with Identity Provider ID");
        }
    }

    // Finally we need to check if the user is an admin or not.
    const isAdmin: boolean = await isUserAdmin(IPId);
    const { contact, employer } = serverUser;
    

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Dashboard </h1>
            <div className="w-full md:w-2/3 space-y-2">
                {serverUser && clerkUser && (
                    <div className="border border-info rounded-md p-4 space-y-2">
                        <h2 className="text-xl font-bold">{serverUser.firstName} {serverUser.middleName} {serverUser.lastName}</h2>
                        <p className="text-sm">User Id: {serverUser.userId}</p>
                        {isUserNew && (
                            <div className="border border-warning bg-warning-content rounded-md p-4">
                                <h2 className="text-warning text-xl font-bold">WELCOME NEW USER!</h2>
                                <p className="text-warning">Please review your personal information below, click on edit to make any changes.</p>
                            </div>
                        )}
                        <div className="md:flex md:justify-between space-y-2 items-baseline gap-2">
                            {contact && (
                                <div className="md:w-1/2 border border-info rounded-md p-4">
                                    <h3 className="text-lg font-bold">Contact</h3>
                                    <p>{contact.email}</p>
                                    <p>{contact.phone}</p>
                                    <p>{contact.addressLine1}</p>
                                    <p>{contact.addressLine2}</p>
                                    <p>{contact.city} {contact.state} {contact.postalCode}</p>
                                </div>
                            )}
                           {employer && (
                                <div className="md:w-1/2 border border-info rounded-md p-4">
                                    <h3 className="text-lg font-bold">Employer</h3>
                                    <p>{employer.employerName}</p>
                                    <p>{employer.jobTitle}</p>
                                </div>
                            )}
                        </div>

                        <div className="w-full border border-info rounded-md p-4">
                            <div className="flex justify-end gap-2">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="btn btn-info dark:text-white">
                                            Admin
                                    </Link>
                                )}
                                <Link 
                                    href={`/user/edit/${serverUser.userId}`}
                                    className="btn btn-warning">
                                        Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                {/* {clerkUser &&
                    <div className="h-96 p-4 border border-info rounded-md overflow-auto">
                        <h2 className="text-xl font-bold">Clerk User</h2>
                        <pre>{JSON.stringify(clerkUser, null, 2)}</pre>
                    </div>
                } */}

            </div>
        </div>
    );
}
export default DashboardPage;