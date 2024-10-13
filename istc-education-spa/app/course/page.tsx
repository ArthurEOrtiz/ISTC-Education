import BrowseCourse from "@/components/course/browse-course";
import CourseList from "@/components/course/course-list";
import { getAllCourses } from "@/utils/api/courses";
import Link from "next/link";

interface CourseIndexPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}


const CourseIndexPage: React.FC<CourseIndexPageProps> = async ({searchParams}) => {
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const startDate = new Date();
    
    const courses = await getAllCourses({page, limit, startDate});

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Courses</h1>
            <div className="w-full max-w-4xl space-y-2 p-4">
                <BrowseCourse
                    page={page}
                    limit={limit}
                    courseCount={courses.length}>
                    <CourseList 
                        courses={courses}
                        hrefSuffix="/course"/>
                </BrowseCourse>
            </div> 
        </div>
    );
}

export default CourseIndexPage;
