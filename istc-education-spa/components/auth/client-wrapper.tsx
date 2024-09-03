
import { useSession } from "next-auth/react";

interface ClientWrapperProps {
    children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
    const { data: session, status } = useSession();


    if (status === "loading") {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">  
                <h1 className="text-2xl">Loading Session...</h1>  
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <>{children}</>
    );
}

export default ClientWrapper;

