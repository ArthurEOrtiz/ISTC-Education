import UserInfo from "@/components/users/user-info";
import { getAllUsers, isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";

const UserIndexPage: React.FC = async() => {
    const { userId: IPId } = auth();
    
    if (!IPId) {
        throw new Error("Autherization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view users");
    }

    const users: User[] = await getAllUsers();

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Users </h1>
            <div className="w-full lg:w-2/3 p-4">
                <div className="flex flex-col space-y-2">
                    {users.map((user, index) => (
                        <div key={index} className="border border-info rounded-md p-4">
                            <UserInfo user={user} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserIndexPage;