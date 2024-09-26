import SearchTopic from "@/components/topic/search-topics";
import TopicList from "@/components/topic/topic-list";
import { getAllTopics } from "@/utils/api/topic";
import { isUserAdmin } from "@/utils/api/users";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface TopicEditPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const TopicEditPage:React.FC<TopicEditPageProps> = async ({searchParams}) => {
    const {userId:IPId} = auth();

    if (!IPId) {
        throw new Error("Authorization Error");
    }

    const isAdmin = await isUserAdmin(IPId);

    if (!isAdmin) {
        throw new Error("You are not authorized to view topics");
    }

    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const search = searchParams.search ? searchParams.search as string : null;

    const topics = await getAllTopics(page, limit, search ? search : undefined);

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Edit Topics</h1>
            <div className="w-full max-w-4xl space-y-2 p-4">
                <SearchTopic
                    page={page}
                    limit={limit}
                    topicCount={topics.length}
                >
                    <div className="flex justify-end">
                        <Link href="/topic/create" className="btn btn-success dark:text-white">
                            <FaPlus/> Topic
                        </Link>
                    </div>
                    <TopicList
                        topics={topics}
                        hrefSuffix="/topic/edit"
                    />
                </SearchTopic>
            </div>
        </div>
    );
}

export default TopicEditPage;