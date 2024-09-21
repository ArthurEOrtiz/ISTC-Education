'use client';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";

interface SearchCourseProps {
    page: number;
    limit: number;
    courseCount: number;
    children: React.ReactNode;
}

const SearchCourse: React.FC<SearchCourseProps> = ({ page, limit, courseCount, children }) => {
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState({
        UpComing: true,
        InProgress: true,
        Completed: false,
        Cancelled: false,
        Archived: false,
    });
    const [url, setUrl] = useState<string>(`edit?page=${page}&limit=${limit}&status=["UpComing","InProgress"]`);
    const [query] = useDebounce(search, 500);
    const router = useRouter();

    useEffect(() => {
        const status = (Object.keys(filters) as (keyof typeof filters)[]) 
            .filter(key => filters[key])
        const baseUrl = `edit?page=${page}&limit=${limit}&status=${JSON.stringify(status)}`;
        setUrl(query ? `${baseUrl}&search=${query}` : baseUrl);
        router.push(query ? `${baseUrl}&search=${query}` : baseUrl);
    }, [filters, query, page, limit, router]);

    const handlePageChange = (newPage: number) => {
        router.push(url.replace(`page=${page}`, `page=${newPage}`));
    };

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
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <>
                {children}
            </>
            <div className="flex justify-between">
                <button 
                    className="btn btn-info"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <button 
                    className="btn btn-info"
                    disabled={courseCount < limit}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </>
    );
}

export default SearchCourse;