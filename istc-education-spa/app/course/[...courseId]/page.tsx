import CourseEnrollmentActions from "@/components/attendance/course-enrollment-actions";
import CourseInfo from "@/components/course/course-info";
import { getCourse } from "@/utils/api/courses";
import { getAttendanceRecords } from "@/utils/api/student";
import { convertDateToMMDDYYYY, convertTo12HourFormat } from "@/utils/global-functions";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface CourseDetailsPageProps {
    params: {
        courseId: string;
    };
}

const CourseDetailsPage: React.FC<CourseDetailsPageProps> = async ({params}) => {
    const courseId: number = parseInt(params.courseId);
    const course: Course | null = await getCourse(courseId);

    if (!course) {
        return notFound();
    }

    const { primaryEmailAddress } = await currentUser() ?? { primaryEmailAddress: null };   

    const student: Student | null = primaryEmailAddress ? await getAttendanceRecords(primaryEmailAddress.emailAddress) : null;

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <div className="sm:w-2/3 sm:flex sm:justify-center">
                <CourseInfo course={course} expanded />
            </div>
            <div className="w-full sm:w-2/3 max-w-3xl space-y-2 px-4">
                <h2 className="text-xl font-bold">Classes</h2>
                <div className="space-y-2 mt-2">
                    {course.classes.map((cls, index) => {
                        const date: string = convertDateToMMDDYYYY(cls.date);
                        const start: string = convertTo12HourFormat(cls.start);
                        const end: string = convertTo12HourFormat(cls.end);
                        return (
                            <div key={index} className="border border-info rounded-md flex justify-between p-4">
                                <p className="font-bold">{date}</p>
                                <p>{start} - {end}</p>
                            </div>
                        );
                    })}
                </div>
                <SignedIn>
                    <CourseEnrollmentActions course={course} student={student} />
                </SignedIn>
            </div>
            
        </div>
    );

}

export default CourseDetailsPage;