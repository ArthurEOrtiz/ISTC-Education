import { getAllTopics } from "@/utils/api/topic";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

const TopicIndexPage: React.FC = async() => {
    const {userId: IPId} = auth();
    
    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view topics");
    }

    const topics = await getAllTopics();

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Topics</h1>
            <div className="w-full lg:w-2/3 p-4">
                <div className="flex flex-col space-y-2">
                    {topics.map((topic, index) => (
                        <div key={index} className="border border-info rounded-md p-4">
                            <p className="text-2xl font-bold">{topic.title}</p>
                            <p>{topic.description}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-2">
                   <Link
                        href="/topic/create"
                        className="btn btn-success dark:text-white"
                    >
                        <FaPlus/> Topic
                    </Link>
                </div>
            </div>
        </div>
    );

}

export default TopicIndexPage;