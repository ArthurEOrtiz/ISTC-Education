'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"
import { useDebounce } from "use-debounce";

const SearchUser: React.FC = () => {
    const [search, setSearch] = useState<string>("");
    const [query] = useDebounce(search, 500);
    const router = useRouter();

    useEffect(() => {
        if (!query) {
            router.push("/user");
            return;
        }
        router.push(`/user?search=${query}`);
    }, [query, router]);

    return (
        <label className="input input-bordered input-info flex items-center gap-2">
            <input 
                type="text" 
                className="grow" 
                placeholder="Search users . . . " 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch/>
        </label>
    );
}

export default SearchUser;
