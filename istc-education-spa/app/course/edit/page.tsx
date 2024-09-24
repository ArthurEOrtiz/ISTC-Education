import CourseList from "@/components/course/course-list";
import SearchCourse from "@/components/course/search-course";
import { CourseStatus } from "@/types/models/course";
import { getAllCourses } from "@/utils/api/courses";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface CourseEditPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const CourseEditPage:React.FC<CourseEditPageProps> = async ({searchParams}) => {
    const { userId:IPId} = auth()

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view topics");
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const search = searchParams.search ? searchParams.search as string : undefined;
    const status: CourseStatus[] | undefined = searchParams.status ? JSON.parse(searchParams.status as string) : undefined;
    // const courses = await getAllCourses(page, limit, status, undefined, undefined, search); 
    const courses = await getAllCourses({page, limit, statuses: status, search});
    

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Edit Courses</h1>
          
            <div className="w-full max-w-4xl space-y-2 p-4">
                <SearchCourse 
                    page={page} 
                    limit={limit}
                    courseCount={courses.length}
                >
                <div className="w-full flex justify-end">
                    <Link href="/course/create" className="btn btn-success dark:text-white">
                        <FaPlus/> Course
                    </Link>
                </div>
                <CourseList 
                    courses={courses}
                    hrefSuffix="/course/edit"
                />
                </SearchCourse>
            </div>
        </div>
    );
}

export default CourseEditPage;