import { Course } from "@/types/models/course";
import { convertDateToMMDDYYYY } from "@/utils/global-functions";
import Link from "next/link";

interface CourseListProps { 
    courses: Course[];
    hrefSuffix: string;
}

const CourseList: React.FC<CourseListProps> = ({courses, hrefSuffix}) => {
    return (
        <>
            {courses.length ? (
                courses.map((course, index) => {
                    const firstDayOfClass: string = course.classes.length > 0 ? convertDateToMMDDYYYY(course.classes[0].date) : "";
    
                    const enrollmentDeadline: string = convertDateToMMDDYYYY(course.enrollmentDeadline);
                    return(
                        <Link 
                            href={`${hrefSuffix}/${course.courseId}`} 
                            className="border border-info hover:bg-info rounded-md flex items-center justify-between gap-4 p-2"
                            key={index}
                            > 
                            <div className="w-1/4">
                                <p className="md:text-xl text-center">{firstDayOfClass}</p> 
                            </div>
                        
                            <div className="w-full border-r border-l border-info px-2">
                                <p className="md:text-2xl font-bold grow">{course.title}</p>
                            </div>
    
                            <div className="w-1/4">
                                <p className="text-xs text-center font-bold">Enrollment Deadline</p>
                                <p className="md:text-xl text-center">{enrollmentDeadline}</p>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <div className="border border-error bg-error-content rounded-md p-4">
                    <p className="text-2xl text-error">No courses found</p>
                </div>
            )}
        </>
    );
}

export default CourseList;