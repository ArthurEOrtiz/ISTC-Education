import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

const MainNav: React.FC = () => {
    return (
        <nav className="md:flex space-x-4">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <SignedIn>
                <Link href="/dashboard">Dashboard</Link>
            </SignedIn>
        </nav>
    );
}

export default MainNav;