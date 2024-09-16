import NotFound from "@/components/html/not-found";

const UserNotFound: React.FC = () => {
    return (
        <NotFound>
            <p>Sorry, the user you are looking for does not exist.</p>
        </NotFound>
    );
}

export default UserNotFound;