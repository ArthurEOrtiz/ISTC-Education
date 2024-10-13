'use client';
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";

interface SearchCourseProps {
    page: number;
    limit: number;
    courseCount: number;
    children: React.ReactNode;
}

const filterDisplayNames: { [key: string]: string } = {
    Upcoming: "Upcoming",
    InProgress: "In Progress",
    Completed: "Completed",
    Cancelled: "Cancelled",
    Archived: "Archived",
};

const SearchCourse: React.FC<SearchCourseProps> = ({ page, limit, courseCount, children }) => {
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState({
        Upcoming: true,
        InProgress: true,
        Completed: false,
        Cancelled: false,
        Archived: false,
    });
    const [url, setUrl] = useState<string>(`edit?page=${page}&limit=${limit}&status=["UpComing","InProgress"]`);
    const [loadingNext, setLoadingNext] = useState<boolean>(false);
    const [loadingPrev, setLoadingPrev] = useState<boolean>(false);
    const [query] = useDebounce(search, 500);
    const searchParams = useSearchParams();
    const router = useRouter();
   
    useEffect(() => {
        const status = (Object.keys(filters) as (keyof typeof filters)[]) 
            .filter(key => filters[key])
        const baseUrl = `edit?page=${page}&limit=${limit}&status=${JSON.stringify(status)}`;
        setUrl(query ? `${baseUrl}&search=${query}` : baseUrl);
        router.push(query ? `${baseUrl}&search=${query}` : baseUrl);
    }, [filters, query, page, limit, router]);

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

    const toggleFilter = (filter: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };

    return (
        <>
            <div className="flex justify-between">
                <label className="input input-bordered input-info flex items-center gap-2">
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Search courses . . . " 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch/>
                </label>
                <div className="join">
                    {(Object.keys(filters) as (keyof typeof filters)[]).map(filter => (
                        <button 
                            key={filter}
                            className={`btn join-item ${filters[filter] ? 'btn-info' : ''}`}
                            onClick={() => toggleFilter(filter as keyof typeof filters)}
                        >
                            {filterDisplayNames[filter]}
                        </button>
                    ))}
                </div>
            </div>
            <>
                {children}
            </>
            <div className="flex justify-between">
                <button 
                    className="btn btn-sm btn-info"
                    disabled={page === 1}
                    onClick={handleNavigatePrev}
                >
                    {loadingPrev ? <span className="loading loading-spinner loading-sm"></span> : 'Previous'}
                </button>
                <button 
                    className="btn btn-sm btn-info"
                    disabled={courseCount < limit}
                    onClick={handleNavigateNext}
                >
                    {loadingNext ? <span className="loading loading-spinner loading-sm"></span> : 'Next'}
                </button>
            </div>
        </>
    );
}

export default SearchCourse;