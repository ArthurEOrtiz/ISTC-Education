import Link from "next/link";
import MainNav from "./main-nav";

const Header:React.FC = () => {
    return (
        <header className="bg-secondary-content p-4">
            <div>
                <Link href="/"><h1 className="text-6xl font-bold">ISTC Education</h1></Link>
            </div>
            <div>
                <MainNav />
            </div>
        </header>
    );
}

export default Header;