import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const CourseCreatePage: React.FC = async() => {
    const IPId: string | null = auth().userId;

    if (!IPId) {
        return notFound();
    }

    const isAdmin: boolean = await isUserAdmin(IPId);

    if (!isAdmin) {
        return notFound();
    }


    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Create Course </h1>
            <div className="lg:w-2/3 border border-info rounded-md p-4">
                
            </div>
        </div>
    );
}

export default CourseCreatePage;
