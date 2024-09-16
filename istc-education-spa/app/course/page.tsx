import { getAllCourses } from "@/utils/api/courses";
import { convertDateToMMDDYYYY } from "@/utils/global-functions";
import Link from "next/link";

const CourseIndexPage: React.FC = async () => {
    const courses = await getAllCourses();

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Courses</h1>

            <div className="space-y-2">
                {courses.map((course) => {
                    const firstDayOfClass: string = course.classes.length > 0 ? convertDateToMMDDYYYY(course.classes[0].date) : "";

                    const enrollmentDeadline: string = convertDateToMMDDYYYY(course.enrollmentDeadline);
                    return(
                        <Link href={`/course/detail/${course.courseId}`} className="border border-info rounded-md sm:flex sm:items-center sm:gap-4 p-2"> 

                            <div className="sm:border-r sm:border-info sm:pr-2">
                                <p className="text-xl">{firstDayOfClass}</p> 
                            </div>
                            
                            <div className="lg:flex lg:gap-4 ">
                                <p className="text-2xl font-bold">{course.title}</p>
                                <div className="flex gap-2 items-center lg:border-l lg:border-info lg:pl-2">
                                    <p className="text-lg font-bold">Enrollment Deadline:</p>
                                    <p className="text-xl">{enrollmentDeadline}</p>
                                </div>
                            </div>
                        </Link>
                    );
            })}
            </div>  
        </div>
    );
}

export default CourseIndexPage;
