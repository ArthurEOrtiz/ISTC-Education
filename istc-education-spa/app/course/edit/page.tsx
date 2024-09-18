import CourseList from "@/components/course/course-list";
import { getAllCourses } from "@/utils/api/courses";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

const CourseEditPage:React.FC = async () => {
    const { userId:IPId} = auth()

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view topics");
    }

    const courses = await getAllCourses();  

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Edit Courses</h1>
          
            <div className="space-y-2">
                <div className="w-full flex justify-end">
                    <Link href="/course/create" className="btn btn-success dark:text-white">
                        <FaPlus/> Course
                    </Link>
                </div>
                <CourseList 
                    courses={courses}
                    hrefSuffix="/course/edit"
                />
            </div>
        </div>
    );
}

export default CourseEditPage;