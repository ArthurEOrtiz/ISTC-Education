import { convertDateToMMDDYYYY } from "@/utils/global-functions";
import Link from "next/link";

interface CourseListProps { 
    courses: Course[];
    hrefSuffix: string;
}

const CourseList: React.FC<CourseListProps> = ({courses, hrefSuffix}) => {
    return (
        <>
            {courses.map((course, index) => {
                    const firstDayOfClass: string = course.classes.length > 0 ? convertDateToMMDDYYYY(course.classes[0].date) : "";

                    const enrollmentDeadline: string = convertDateToMMDDYYYY(course.enrollmentDeadline);
                    return(
                        <Link 
                            href={`${hrefSuffix}/${course.courseId}`} 
                            className="border border-info hover:bg-info rounded-md sm:flex sm:items-center sm:gap-4 p-2"
                            key={index}
                            > 
                            <div className="sm:border-r sm:border-info sm:pr-2">
                                <p className="text-xl">{firstDayOfClass}</p> 
                            </div>
                        
                            <p className="text-2xl font-bold grow">{course.title}</p>

                            <div className="flex gap-2 items-center lg:border-l lg:border-info lg:pl-2">
                                <p className="text-lg font-bold">Enrollment Deadline:</p>
                                <p className="text-xl">{enrollmentDeadline}</p>
                            </div>
                        </Link>
                    );
                })}
        </>
    );
}

export default CourseList;