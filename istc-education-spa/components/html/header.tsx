import Link from "next/link";
import MainNav from "./main-nav";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Image from 'next/image'

const Header:React.FC = () => {
    return (
        <header className="w-full bg-cyan-700 text-white p-4">
            <div className="flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center space-y-2">
                    <Image
                        src="/idahoLogo.svg"
                        alt="Idaho Logo"
                        width={175}
                        height={175}
                    />
                    <h1 className="text-5xl font-bold">Education Program</h1>
                </Link>
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