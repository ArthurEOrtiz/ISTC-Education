'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"
import { useDebounce } from "use-debounce";

interface SearchUserProps {
    page: number;
    limit: number;
    urlPrefix: string;
    userCount: number;
    children: React.ReactNode;
}

const SearchUser: React.FC<SearchUserProps> = ({ page, limit, urlPrefix, userCount, children }) => {
    const [ url, setUrl ] = useState<string>(`${urlPrefix}?page={page}&limit={limit}`);   
    const [search, setSearch] = useState<string>("");
    const [query] = useDebounce(search, 500);
    const [loadingNext, setLoadingNext] = useState<boolean>(false);
    const [loadingPrev, setLoadingPrev] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const baseUrl = `${urlPrefix}?page=${page}&limit=${limit}`;
        setUrl(query ? `${baseUrl}&search=${query}` : baseUrl);
        router.push(query ? `${baseUrl}&search=${query}` : baseUrl);
    }, [query, page, limit, router]);

    useEffect(() => {
        setLoadingNext(false);
        setLoadingPrev(false);
    }, [searchParams]);

    const handleNavigateNext = () => {
        setLoadingNext(true);
        router.push(url.replace(`page=${page}`, `page=${page + 1}`));
    }

    const handleNavigatePrev = () => {
        setLoadingPrev(true);
        router.push(url.replace(`page=${page}`, `page=${page - 1}`));
    }


    return (
        <>
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
            {children}
            <div className="flex justify-between">
                <button 
                    className="btn btn-info btn-sm"
                    disabled={page === 1}
                    onClick={handleNavigatePrev}
                >
                    {loadingPrev ? <span className="loading loading-spinner loading-sm"></span> : 'Previous'}
                </button>
                <button 
                    className="btn btn-info btn-sm"
                    disabled={userCount < limit}
                    onClick={handleNavigateNext}
                >
                    {loadingNext ? <span className="loading loading-spinner loading-sm"></span> : 'Next'}
                </button>
            </div>
        </>
    );
}

export default SearchUser;
