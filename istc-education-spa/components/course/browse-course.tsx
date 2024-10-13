'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface BrowseCourseProps {
    page: number;
    limit: number;
    courseCount: number;
    children: React.ReactNode;
}

const BrowseCourse: React.FC<BrowseCourseProps> = ({ page, limit, courseCount, children }) => {
    const [loadingNext, setLoadingNext] = useState<boolean>(false);
    const [loadingPrev, setLoadingPrev] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    
    useEffect(() => {
        setLoadingNext(false);
        setLoadingPrev(false);
    }, [searchParams]);

    const handleNavigateNext = () => {
        setLoadingNext(true);
        router.push(`/course?page=${page + 1}&limit=${limit}`);
    }

    const handleNavigatePrev = () => {
        setLoadingPrev(true);
        router.push(`/course?page=${page - 1}&limit=${limit}`);
    }
    
    return (
        <>
            {children}
            <div className="flex justify-between">
                <button 
                    onClick={handleNavigatePrev}
                    className={`btn btn-sm ${page === 1 ? 'btn-disabled' : 'btn-info'}`}
                    disabled={page === 1}
                    >
                        {loadingPrev ? <span className="loading loading-spinner loading-sm"></span> : 'Previous'}
                </button>
                <button 
                    onClick={handleNavigateNext}
                    className={`btn btn-sm ${courseCount < limit ? 'btn-disabled' : 'btn-info'}`}
                    disabled={courseCount < limit}
                    >
                        {loadingNext ? <span className="loading loading-spinner loading-sm"></span> : 'Next'}
                </button>
            </div>
        </>
    );
}

export default BrowseCourse;