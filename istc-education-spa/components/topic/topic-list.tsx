import { Topic } from "@/types/models/topic";
import Link from "next/link";

interface TopicListProps {
    topics: Topic[];
    hrefSuffix: string;
}

const TopicList: React.FC<TopicListProps> = ({topics, hrefSuffix}) => (
    <>
        {topics.length ? (
            topics.map((topic, index) => (
            <Link 
                key={index} 
                className="border border-info rounded-md flex p-4"
                href={`${hrefSuffix}/${topic.topicId}`}
                >
                
                <p className="text-2xl font-bold">{topic.title}</p>
            </Link>
        ))
        ) : (
            <div className="border border-error bg-error-content rounded-md p-4">
                <p className="text-2xl text-error">No topics found</p>
            </div>
        )}
    </>
);

export default TopicList;