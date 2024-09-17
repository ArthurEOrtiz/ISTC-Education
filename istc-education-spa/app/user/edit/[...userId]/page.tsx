import { EditUser } from "@/components/users/edit-user";
import { getUser, isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface UserEditPageProps {
    params: {
        userId: string;
    };
}

const UserEditPage: React.FC<UserEditPageProps> =  async ({ params }) => {
    const userId: number = parseInt(params.userId);    
    const user: User | null = await getUser(userId); 

    if (!user) {
        return notFound();
    }

    const { userId: IPId } = auth();
    
    if (!IPId) {
        throw new Error("Autherization Error");
    }

    const isAdmin: boolean = await isUserAdmin(IPId);

    if (isAdmin){
        // If the user is an admin, they can edit any user
        return (
            <div className="w-full flex flex-col items-center space-y-2">
                <h1 className="text-3xl font-bold"> Edit User </h1>
                {user && (
                    <EditUser user={user} isAdmin />
                )}
            </div>
        )
    } else if (user.ipId === IPId) {
        // If the user is not an admin, they can only edit their own user
        return (
            <div className="w-full flex flex-col items-center space-y-2">
                <h1 className="text-3xl font-bold"> Edit User </h1>
                {user && (
                    <EditUser user={user} />
                )}
            </div>
        )
    } else {
        // If the user is not an admin and they are not the user they are trying to edit
        throw new Error("You are not authorized to edit this user");
    }
}

export default UserEditPage;
    