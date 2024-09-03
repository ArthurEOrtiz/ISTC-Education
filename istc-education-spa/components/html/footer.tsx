import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary-content text-md w-full p-4">
            <div>
                <h2 className="font-bold">ISTC Education</h2>
                <nav className="text-sm flex flex-col">
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </nav>
            </div>
            <div>
                <p className="text-sm text-center">&copy; 2024 Arthur Edward Ortiz </p>
            </div>
        </footer>
    );
}

export default Footer;