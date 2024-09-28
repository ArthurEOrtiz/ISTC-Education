import SearchTopic from "@/components/topic/search-topics";
import TopicList from "@/components/topic/topic-list";
import { getAllTopics } from "@/utils/api/topic";

interface TopicIndexPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}


const TopicIndexPage: React.FC<TopicIndexPageProps> = async({searchParams}) => {
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit as string) : 10;
    const search = searchParams.search ? searchParams.search as string : null;

    const topics = await getAllTopics(page, limit, search ? search : undefined);

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Topics</h1>
            <div className="w-full max-w-4xl space-y-2 p-4">
                    <SearchTopic
                        page={page}
                        limit={limit}
                        topicCount={topics.length}
                    >
                        <TopicList
                            topics={topics}
                            hrefSuffix="/topic"
                        />
                    </SearchTopic>

            </div>
            
        </div>
    );

}

export default TopicIndexPage;