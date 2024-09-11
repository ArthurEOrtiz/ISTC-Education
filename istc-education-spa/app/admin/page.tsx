import Link from "next/link"

const AdminPage: React.FC = async () => {
    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Admin Dashboard </h1>
            <div className="border border-info rounded-md p-4">
                <h2 className="text-xl font-bold">Admin Actions</h2>
                <div className="flex flex-col space-y-2">
                    <Link href="/course/create" className="btn btn-success dark:text-white">
                        Create Course
                    </Link>
                    <Link href="/user/create" className="btn btn-success dark:text-white">
                        Create User
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;