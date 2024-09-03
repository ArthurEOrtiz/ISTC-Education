import Link from "next/link";
import MainNav from "./nav-main";

const Header:React.FC = () => {
    return (
        <header className="bg-secondary-content p-4">
            <Link href="/"><h1 className="text-6xl font-bold">ISTC Education</h1></Link>
            <MainNav />
        </header>
    );
}

export default Header;