import Link from "next/link";

const MainNav: React.FC = () => {
    return (
        <nav className="flex space-x-4">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/restricted">Restricted</Link>
        </nav>
    );
}

export default MainNav;