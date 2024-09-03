import SignInButton from "@/components/auth/sign-in-button";
import SignOutButton from "@/components/auth/signout-button";
import { nextAuthOptions } from "@/lib/next-auth-options";
import { getServerSession } from "next-auth";

const RestrictedPage: React.FC = async () => {
    const session = await getServerSession(nextAuthOptions);

    if (!session) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center space-y-2">
                <h1 className="text-3xl font-bold text-error">You are not authenticated</h1>
                <p className="text-lg">Log in to demo `getServerSession()`</p>
                <SignInButton />
            </div>
        );
    }

    if (session) {
        return (
            <div className="flex-grow flex flex-col justify-center items-center space-y-2">
                <div>
                    <h1 className="text-3xl font-bold">You are authenticated</h1>
                </div>
                <div className="space-y-2">
                    <div className="border rounded-xl p-2">
                        <p className="text-lg">Session:</p>
                        <pre>{JSON.stringify(session, null, 2)}</pre>
                    </div>
                    <div className="w-full flex justify-end">
                        <SignOutButton callbackUrl="/restricted" />
                    </div>
                </div>
            </div>
        );
    }
}

export default RestrictedPage;