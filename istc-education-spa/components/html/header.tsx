import Link from "next/link";
import MainNav from "./main-nav";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

const Header:React.FC = () => {
    return (
        <header className="w-full bg-secondary-content p-4">
            <div>
                <Link href="/"><h1 className="text-6xl font-bold">ISTC Education</h1></Link>
            </div>
            <div className="md:flex justify-between items-center">
                <MainNav />
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="btn btn-success text-white">Sign In</button>
                    </SignInButton>
                </SignedOut>
            </div>
        </header>
    );
}

export default Header;