import CreateTopic from "@/components/topic/create-topic";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";

const TopicCreatePage: React.FC = async() => {
    const { userId: IPId } = auth();

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to create a topic");
    }

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Create Topic</h1>
            <CreateTopic />
        </div>
    );
}

export default TopicCreatePage;


