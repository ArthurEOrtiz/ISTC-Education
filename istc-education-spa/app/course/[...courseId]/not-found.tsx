import NotFound from "@/components/html/not-found";

const CourseDetailNotFound: React.FC = () => {
    return (
        <NotFound>
            <p>Sorry, the course you are looking for does not exist.</p>
        </NotFound>
    );
}

export default CourseDetailNotFound;