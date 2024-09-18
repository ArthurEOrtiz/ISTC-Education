import CourseList from "@/components/course/course-list";
import { getAllCourses } from "@/utils/api/courses";


const CourseIndexPage: React.FC = async () => {
    const courses = await getAllCourses();

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Courses</h1>

            <div className="space-y-2">
                <CourseList 
                    courses={courses}
                    hrefSuffix="/course"/>
            </div>  
        </div>
    );
}

export default CourseIndexPage;
