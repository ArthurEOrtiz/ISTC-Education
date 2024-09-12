import CreateCourse from "@/components/course/create-course";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";

const CourseCreatePage: React.FC = async() => {
    const { userId: IPId } = auth();

    if (!IPId) {
        throw new Error("Autherization Error");
    }

    const isAdmin: boolean = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to create a course");
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold"> Create Course </h1>
            <CreateCourse />
        </div>
    );
}

export default CourseCreatePage;
