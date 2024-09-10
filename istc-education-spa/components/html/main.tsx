import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

interface MainProps {
    children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
    return (
        <main className="bg-primary-content flex-grow flex p-4">
            <ClerkLoading>
                <div className="w-full flex flex-col justify-center items-center">
                    <p className="text-3xl font-bold">Loading Session...</p>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </ClerkLoading>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>
        </main>
    );
}

export default Main;