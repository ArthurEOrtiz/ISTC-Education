import Link from "next/link";
import MainNav from "./main-nav";
import { SignedIn, UserButton } from "@clerk/nextjs"

const Header:React.FC = () => {
    return (
        <header className="bg-secondary-content p-4">
            <div>
                <Link href="/"><h1 className="text-6xl font-bold">ISTC Education</h1></Link>
            </div>
            <div className="flex justify-between">
                <MainNav />
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    );
}

export default Header;