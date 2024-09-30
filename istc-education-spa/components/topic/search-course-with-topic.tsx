'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";

interface SearchCourseWithTopicProps {
    page: number;
    limit: number;
    courseCount: number;
    topicId: number;
    admin?: boolean;
    children: React.ReactNode;
}

const SearchCourseWithTopic: React.FC<SearchCourseWithTopicProps> = ({ page, limit, courseCount, topicId, admin=false, children }) => {
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState(() => {
        const defaultFilters = {
            Upcoming: true,
            InProgress: true,
            Completed: false,
        };

        if (admin) {
            return {
                ...defaultFilters,
                Cancelled: false,
                Archived: false,
            };
        }

        return defaultFilters;
    });
    const [url, setUrl] = useState<string>(`/topic/${admin? 'edit/':''}${topicId}/page?page=${page}&limit=${limit}&status=["UpComing","InProgress"]`);
    const [query] = useDebounce(search, 500);
    const router = useRouter();
    const [searching, setSearching] = useState(false);
    const [navigatingNext, setNavigatingNext] = useState(false);
    const [navigatingPrev, setNavigatingPrev] = useState(false);
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const status = (Object.keys(filters) as (keyof typeof filters)[]) 
            .filter(key => filters[key])
        const baseUrl = `/topic/${admin ?'edit/' : ''}${topicId}/page?page=${page}&limit=${limit}&status=${JSON.stringify(status)}`;
        setUrl(query ? `${baseUrl}&search=${query}` : baseUrl);
        router.push(query ? `${baseUrl}&search=${query}` : baseUrl);
        router.refresh();
    }, [filters, query, page, router]);

    useEffect(() => {
        setSearching(true);
    }, [query]);

    useEffect(() => {
        setSearching(false);
        setNavigatingNext(false);
        setNavigatingPrev(false);
    }, [searchParams]);
    
    const handlePageChange = (newPage: number) => {
        if (newPage < page) {
            setNavigatingPrev(true);
        } else {
            setNavigatingNext(true);
        }
        router.push(url.replace(`page=${page}`, `page=${newPage}`));
    };
    
    const toggleFilter = (filter: keyof typeof filters) => {
        setSearching(true);
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
                    {searching ? <span className="loading loading-dots"></span>: <FaSearch/>}
                </label>
                <div className="join">
                    {(Object.keys(filters) as (keyof typeof filters)[]).map(filter => (
                        <button 
                            key={filter}
                            className={`btn join-item ${filters[filter] ? 'btn-info' : ''}`}
                            onClick={() => toggleFilter(filter as keyof typeof filters)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
            {children}
            <div className="flex justify-between">
                <button 
                    className={`btn btn-sm ${page === 1 ? 'btn-disabled' : 'btn-info'}`}
                    onClick={() => handlePageChange(page - 1)}
                >
                    {navigatingPrev ? <span className="loading loading-spinner"></span> : 'Previous'}
                </button>
                <button 
                    className={`btn btn-sm ${courseCount < limit ? 'btn-disabled' : 'btn-info'}`}
                    onClick={() => handlePageChange(page + 1)}
                >
                    {navigatingNext ? <span className="loading loading-spinner"></span> : 'Next'}
                </button>
            </div>
        </>
    );
}

export default SearchCourseWithTopic;
