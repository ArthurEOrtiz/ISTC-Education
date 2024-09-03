import { UserButton } from "@clerk/nextjs"

const RestrictedPage: React.FC = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-error">Restricted Page</h1>
            <UserButton />  
        </div>
    );
}

export default RestrictedPage;

