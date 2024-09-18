interface TopicsDetailsPageProps {
    params: {
        topicId: string;
    };
}

const TopicsDetailsPage: React.FC<TopicsDetailsPageProps> = async ({params}) => {
    return (
        <div>
            <h1>Topics Details Page</h1>
        </div>
    );
}

export default TopicsDetailsPage;