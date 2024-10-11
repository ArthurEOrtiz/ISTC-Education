import EditCourse from "@/components/course/edit-course";
import { Course } from "@/types/models/course";
import { getCourse } from "@/utils/api/courses";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface CourseEditPageProps {
    params: {
        courseId: string;
    };
}

const CourseEditPage: React.FC<CourseEditPageProps> = async({params}) => {
    const courseId: number = parseInt(params.courseId);
    const course: Course | null = await getCourse(courseId);

    if (!course) {
        return notFound();
    }

    const { userId: IPId } = auth();

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin: boolean = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to edit this course");
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            
            <EditCourse course={course} />
        </div>
    );
}

export default CourseEditPage;