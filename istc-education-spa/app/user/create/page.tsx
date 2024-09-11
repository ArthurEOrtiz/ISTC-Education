import { auth } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/utils/api/users";
import CreateUser from "@/components/users/create-user";

const UserCreatePage: React.FC = async() => {
    const { userId: IPId } =  auth();

    if (!IPId) {
        throw new Error("Autherization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to create a user");
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Create User </h1>
            <CreateUser />
        </div>
    )
}

export default UserCreatePage;