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

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Edit User </h1>
            {user && (
                <EditUser user={user} isAdmin={isAdmin} />
            )}
        </div>
    )
}

export default UserEditPage;
    