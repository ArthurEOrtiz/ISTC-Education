import EditTopic from "@/components/topic/edit-topic";
import { Topic } from "@/types/models/topic";
import { getTopic } from "@/utils/api/topic";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface TopicEditPageProps {
    params: {
        topicId: string;
    };
}

const TopicEditPage: React.FC<TopicEditPageProps> = async({params}) => {
    const topicId: number = parseInt(params.topicId);
    const topic: Topic | null = await getTopic(topicId);
    
    if (!topic) {
        return notFound();
    }

    const { userId: IPId } = auth();

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin: boolean = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to edit this topic");
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <EditTopic topic={topic} />
        </div>
    );
}

export default TopicEditPage;
    