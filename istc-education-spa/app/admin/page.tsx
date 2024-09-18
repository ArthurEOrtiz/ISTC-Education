import Link from "next/link"

const AdminPage: React.FC = async () => {
    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Admin Dashboard </h1>
            <div className="border border-info rounded-md p-4">
                <h2 className="text-xl font-bold">Admin Actions</h2>
                <div className="flex gap-2">
                    <Link href="/course/edit" className="btn btn-primary">
                        Edit Courses
                    </Link>
                    <Link href="/user" className="btn btn-primary">
                        Edit Users
                    </Link>
                    <Link href="/topic/create" className="btn btn-primary">
                        Create Topic
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;