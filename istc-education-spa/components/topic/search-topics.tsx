'use client';
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";

interface SearchTopicProps {
    page: number;
    limit: number;
    topicCount: number;
    children: React.ReactNode;
}

const SearchTopic: React.FC<SearchTopicProps> = ({ page, limit, children, topicCount }) => {
    const [ url, setUrl ] = useState<string>(`?page=${page}&limit=${limit}`);
    const [ search, setSearch ] = useState<string>("");
    const [ query ] = useDebounce(search, 500);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ pageLoading, setPageLoading ] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        setUrl(query ? `?page=${page}&limit=${limit}&search=${query}` : `?page=${page}&limit=${limit}`);
        router.push(query ? `?page=${page}&limit=${limit}&search=${query}` : `?page=${page}&limit=${limit}`);
    }, [query, page, limit, router]);

    useEffect(() => {
        setPageLoading(false);
        setLoading(false);
    }, [searchParams]);

    const handlePageChange = (newPage: number) => {
        setPageLoading(true);
        router.push(url.replace(`page=${page}`, `page=${newPage}`));
    };

    return (
        <>
            <div className="space-y-2">
                <label className="input input-bordered input-info input-lg flex items-center gap-2">
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Search topics . . . " 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {loading ? <span className="loading loading-dots"></span>: <FaSearch/>}
                </label>

                {children}
                <div className="flex justify-between">
                    <button 
                        onClick={() => handlePageChange(page - 1)} 
                        disabled={page === 1}
                        className={`btn btn-sm ${page === 1 ? 'btn-disabled' : 'btn-info'}`}
                    >
                        {!pageLoading ? 'Previous' : <span className="loading loading-spinner loading-sm"></span>}
                    </button>
                    <button 
                        onClick={() => handlePageChange(page + 1)} 
                        disabled={topicCount < limit}
                        className={`btn btn-sm ${topicCount < limit ? 'btn-disabled' : 'btn-info'}`}
                    >
                        {!pageLoading ? 'Next' : <span className="loading loading-spinner loading-sm"></span>}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SearchTopic;