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
        
                <CourseList 
                    courses={courses}
                    hrefSuffix="/course"/>
           
                
                <div className="flex justify-between">
                    <Link 
                        href={`/course?page=${page - 1}&limit=${limit}`}
                        className={`btn btn-sm ${page === 1 ? 'btn-disabled' : 'btn-info'}`}>
                            Previous
                    </Link>
                    <Link 
                        href={`/course?page=${page + 1}&limit=${limit}`}
                        className={`btn btn-sm ${courses.length < limit ? 'btn-disabled' : 'btn-info'}`}>
                            Next
                    </Link>
                </div>
            </div> 
        </div>
    );
}

export default CourseIndexPage;
