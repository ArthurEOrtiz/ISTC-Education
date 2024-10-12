import SearchUser from "@/components/users/search-user";
import { getAllUsersWithCertifications, isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface CertificationIndexPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const CertificationIndexPage: React.FC<CertificationIndexPageProps> = async({searchParams}) => {
    const { userId:IPId } = auth()

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view certifications");
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const search = searchParams.search ? searchParams.search as string : undefined;

    const users: User[] = await getAllUsersWithCertifications(page, limit, search);
    
    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Certifications</h1>
            <p>The following list conatins users with pending approved or rejected certifications</p>
            <div className="w-full max-w-2xl space-y-2 p-4">
                <SearchUser
                    page={page}
                    limit={limit}
                    userCount={users.length}
                    urlPrefix="/certification"
                >
                    <div className="space-y-2">
                        {users.map((user, index) => (
                            <Link
                                key={index}
                                href={`/user/edit/${user.userId}?info=false&certifications=true`}
                                className="border border-info hover:bg-info rounded-md flex gap-2 items-center p-4"
                            >
                                <p className="sm:text-2xl font-bold border-r border-info pr-2">
                                    {user.lastName}, {user.firstName} {user.middleName}
                                </p>
                                <p className="sm:text-xl">{user.contact.email}</p>
                            </Link>
                        ))}
                    </div>
                </SearchUser>
            </div>
        </div>
    );
}

export default CertificationIndexPage;