import CourseList from "@/components/course/course-list";
import { Course } from "@/types/models/course";
import { Topic } from "@/types/models/topic";
import { getAllCourses } from "@/utils/api/courses";
import { getTopic } from "@/utils/api/topic";
import { notFound } from "next/navigation";

interface TopicsDetailsPageProps {
    params: {
        topicId: string;
    };
}

const TopicsDetailsPage: React.FC<TopicsDetailsPageProps> = async ({params}) => {
    const topicId: number = parseInt(params.topicId);
    const topic: Topic | null = await getTopic(topicId);
    const courses: Course[] = await getAllCourses({topicIds: [topicId]});

    console.log(courses);

    if (!topic) {
        return notFound();
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <div className="w-full lg:w-2/3 space-y-2 p-4">
                <div className="border border-info rounded-md p-4">
                    {topic.description && topic.description.length > 0 ? (
                        <p>{topic.description}</p>
                    ) : (
                        <p className="text-error">No description available</p>
                    )}
                </div>
                    <CourseList
                        courses={topic.courses || []}
                        hrefSuffix="/course"
                    />
            </div>
        </div>
    );
}

export default TopicsDetailsPage;