import CourseList from "@/components/course/course-list";
import SearchCourseWithTopic from "@/components/topic/search-course-with-topic";
import { Course, CourseStatus } from "@/types/models/course";
import { Topic } from "@/types/models/topic";
import { getAllCourses } from "@/utils/api/courses";
import { getTopic } from "@/utils/api/topic";
import { notFound } from "next/navigation";

interface TopicsDetailsPageProps {
    params: {
        topicId: string;
    };

    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const TopicsDetailsPage: React.FC<TopicsDetailsPageProps> = async ({params, searchParams}) => {
    const topicId: number = parseInt(params.topicId);
    const topic: Topic | null = await getTopic(topicId);
    
    if (!topic) {
        return notFound();
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const search = searchParams.search ? searchParams.search as string : "";
    const statuses: CourseStatus[] | undefined = searchParams.status ? JSON.parse(searchParams.status as string) : undefined;
    const courses: Course[] = await getAllCourses({ page, limit, search, statuses, topicIds: [topicId]});

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
                <h2 className="text-2xl font-bold">Courses</h2>
                <SearchCourseWithTopic
                    page={page}
                    limit={10}
                    courseCount={courses.length}
                    topicId={topicId}
                >
                <CourseList
                    courses={courses}
                    hrefSuffix="/course"
                />
                </SearchCourseWithTopic>
            </div>
        </div>
    );
}

export default TopicsDetailsPage;