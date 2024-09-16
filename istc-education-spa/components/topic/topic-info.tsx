interface TopicInfoProps {
    topic: Topic;
}

const TopicInfo: React.FC<TopicInfoProps> = ({ topic }) => {
    return (
        <div className="">
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <p>{topic.description}</p>
        </div>
    );
}

export default TopicInfo;