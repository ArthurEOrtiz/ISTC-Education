import Link from "next/link"

const AdminPage: React.FC = async () => {
    return (
        <div className="w-full max-w-xl flex flex-col mx-auto space-y-2">
            <h1 className="text-3xl font-bold text-center"> Admin Dashboard </h1>
            <div className="w-full border border-info rounded-md space-y-2 p-4">
                <h2 className="text-xl font-bold">Edit</h2>
                <div className="flex gap-2">
                    <Link href="/course/edit" className="btn btn-primary btn-sm">
                        Courses
                    </Link>
                    <Link href="/user" className="btn btn-primary btn-sm">
                        Users
                    </Link>
                    <Link href="/topic/edit" className="btn btn-primary btn-sm">
                        Topics
                    </Link>
                    <Link href="/certification" className="btn btn-primary btn-sm">
                        Certifications
                    </Link>
                </div>
            </div>

            <div className="w-full border border-info rounded-md space-y-2 p-4">
                <h2 className="text-xl font-bold">Reports</h2>
                <div className="flex gap-2">
                    <Link href="/report/course" className="btn btn-primary btn-sm">
                        Course Reports
                    </Link>
                    <Link href="/report/user" className="btn btn-primary btn-sm">
                        User Reports
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;