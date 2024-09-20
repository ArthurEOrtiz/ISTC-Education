import SearchUser from "@/components/users/search-user";
import { getAllUsers, isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface UserIndexPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const UserIndexPage: React.FC<UserIndexPageProps> = async({searchParams}) => {
    const { userId: IPId } = auth();
    
    if (!IPId) {
        throw new Error("Autherization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view users");
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const search = searchParams.search ? searchParams.search as string : undefined;

    const users: User[] = await getAllUsers(page, limit, search);

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Users </h1>
            <div className="w-full lg:w-2/3 space-y-2 p-4">
                <div>
                    <SearchUser/>
                </div>
                <div className="w-full flex justify-end">
                    <Link href="/user/create" className="btn btn-success dark:text-white">
                        <FaPlus/> User
                    </Link>
                </div>
                <div className="flex flex-col space-y-2">
                    {users.map((user, index) => (
                        <Link 
                            key={index}
                            href={`/user/edit/${user.userId}`} 
                            className="border border-info hover:bg-info rounded-md flex gap-2 items-center p-4">
                            <p className="sm:text-2xl font-bold border-r border-info pr-2">{user.lastName}, {user.firstName} {user.middleName} </p>
                            <p className="sm:text-xl">{user.contact.email}</p>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-between">
                    <Link 
                        href={`/user?page=${page - 1}&limit=${limit}`}
                        className={`btn ${page === 1 ? 'btn-disabled' : 'btn-info dark:text-white'}`}>
                            Previous
                    </Link>
                    <Link 
                        href={`/user?page=${page + 1}&limit=${limit}`}
                        className={`btn ${users.length < limit ? 'btn-disabled' : 'btn-info dark:text-white'}`}>
                            Next
                    </Link>  

                </div>
            </div>
        </div>
    );
}

export default UserIndexPage;