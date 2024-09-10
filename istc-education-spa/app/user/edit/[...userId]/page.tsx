import { EditUser } from "@/components/users/edit-user";
import { User } from "@/types/user";
import { getUser } from "@/utils/api/users";
import { notFound } from "next/navigation";

interface UserEditPageProps {
    params: {
        userId: string;
    };
}

const UserEditPage: React.FC<UserEditPageProps> =  async ({ params }) => {
    const userId: number = parseInt(params.userId);    
    const user: User | null = await getUser(userId) 

    if (!user) {
        return notFound();
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Edit User </h1>
            {user && (
                <EditUser user={user} />
            )}
        </div>
    )
}

export default UserEditPage;
    