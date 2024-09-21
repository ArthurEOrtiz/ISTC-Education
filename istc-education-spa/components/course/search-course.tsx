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

const SearchCourse: React.FC<SearchCourseProps> = ({ page, limit, courseCount, children}) => {
    const [search, setSearch] = useState<string>("");
    const [upcoming , setUpcoming] = useState<boolean>(true);
    const [inProgress , setInProgress] = useState<boolean>(true);
    const [completed , setCompleted] = useState<boolean>(false);
    const [cancelled , setCancelled] = useState<boolean>(false);
    const [archived , setArchived] = useState<boolean>(false);
    const [url , setUrl] = useState<string>(`edit?page=${page}&limit=${limit}&status=["UpComing","InProgress"]`);
    const [query] = useDebounce(search, 500);
    const router = useRouter();

    useEffect(() => {
        if (!query) {
            router.push(url);
            return;
        }
        
        const urlPlusSearch = `${url}&search=${query}`;
        router.push(urlPlusSearch);

    }, [query, url, router]);

    useEffect(() => {
        const status = [];
        if (upcoming) {
            status.push("UpComing");
        }
        if (inProgress) {
            status.push("InProgress");
        }
        if (completed) {
            status.push("Completed");
        }
        if (cancelled) {
            status.push("Cancelled");
        }
        if (archived) {
            status.push("Archived");
        }
        const url = `edit?page=${page}&limit=${limit}&status=${JSON.stringify(status)}`;
        setUrl(url);
    }, [upcoming, inProgress, completed, cancelled, archived]);

    const handleNextPage = () => {
       setUrl(url.replace(`page=${page}`, `page=${page + 1}`));
    }

    const handlePreviousPage = () => {
        setUrl(url.replace(`page=${page}`, `page=${page - 1}`));
    }

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
                    <button 
                        className={`btn join-item ${upcoming ? 'btn-info': ''}`}
                        onClick={() => setUpcoming(!upcoming)}
                        >
                            Upcoming
                    </button>
                    <button 
                        className={`btn join-item ${inProgress ? 'btn-info': ''}`}
                        onClick={() => setInProgress(!inProgress)}
                        >
                            In Progress
                    </button>
                    <button 
                        className={`btn join-item ${completed ? 'btn-info': ''}`}
                        onClick={() => setCompleted(!completed)}
                        >
                            Completed
                    </button>
                    <button 
                        className={`btn join-item ${cancelled ? 'btn-info': ''}`}
                        onClick={() => setCancelled(!cancelled)}
                        >
                            Cancelled</button>
                    <button 
                        className={`btn join-item ${archived ? 'btn-info': ''}`}
                        onClick={() => setArchived(!archived)}
                        >
                            Archived
                    </button>
                </div>
            </div>
            <>
                {children}
            </>
            <div className="flex justify-between">
                <button 
                    className="btn btn-info"
                    disabled={page === 1}
                    onClick={handlePreviousPage}
                    >
                        Previous
                </button>
                <button 
                    className="btn btn-info"
                    disabled={courseCount < limit}
                    onClick={handleNextPage}
                    >
                        Next
                </button>
            </div>
        </>
    );
}

export default SearchCourse;