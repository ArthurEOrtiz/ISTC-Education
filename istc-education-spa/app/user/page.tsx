import { getAllUsers, isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

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
            <div className="w-full lg:w-2/3 space-y-2 p-4">
                <div className="w-full flex justify-end">
                    <Link href="/user/create" className="btn btn-success dark:text-white">
                        <FaPlus/> User
                    </Link>
                </div>
                <div className="flex flex-col space-y-2">
                    {users.map((user, index) => (
                        <div key={index} className="border border-info rounded-md flex gap-2 items-center p-4">
                            <p className="text-2xl font-bold border-r border-info pr-2">{user.firstName} {user.middleName} {user.lastName}</p>
                            <p className="text-xl">{user.contact.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserIndexPage;