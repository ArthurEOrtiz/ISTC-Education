"use client";

import { Course } from "@/types/models/course";
import { getAllCourses } from "@/utils/api/courses";
import { getStudentEnrollment, getStudents } from "@/utils/api/student";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import CourseList from "../course/course-list";

interface UserStudentHistoryProps {
    studentId: number | undefined;
}

const UserStudentHistory: React.FC<UserStudentHistoryProps> = ({ studentId }) => {

    const [ student, setStudent ] = useState<Student | null>();
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);
    
    const [ enrolledCourses, setEnrolledCourses ] = useState<Course[]>([]);
    const [ isEnrolledExpanded, setIsEnrolledExpanded ] = useState<boolean>(false);
    const [ isEnrolledLoading, setIsEnrolledLoading ] = useState<boolean>(false);

    const [ search, setSearch ] = useState<string>("");
    const [ page, setPage ] = useState<number>(1);
    const limit = 5;
    const [ query ] = useDebounce(search, 500);

    const [ filters, setFilters ] = useState({
        Upcoming: true,
        InProgress: true,
        Completed: false,
    });

    const [ waitListedCourses, setWaitListedCourses ] = useState<Course[]>([]);
    const [ isWaitlistExpanded, setIsWaitlistExpanded ] = useState<boolean>(false);
    const [ isWaitListLoading, setIsWaitListLoading ] = useState<boolean>(false);   

    useEffect(() => {
        if (!studentId) {
            return;
        }
        setLoading(true);
        getStudents({ studentId }).then((student) => {
            setStudent(student as Student);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoading(false);
        });
    }, []);


    useEffect(() => {
        setIsEnrolledLoading(true);
        const statuses = (Object.keys(filters) as (keyof typeof filters)[]).filter((key) => filters[key]);
        if (statuses.length === 0) {
            setEnrolledCourses([]);
            setIsEnrolledLoading(false);
            return;
        }
        getStudentEnrollment({ studentId, search: query, page, limit, statuses}).then((courses) => {
            setEnrolledCourses(courses);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setIsEnrolledLoading(false);
        });
    }, [query, page, limit, filters]);

    const toggleFilter = (filter: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };
   
   
    const getWaitListedCourses = () => {
        const courseIds = student && student.waitLists ? student.waitLists.map((waitList) => waitList.courseId) : undefined; 
        
        if (!courseIds) {
            return;
        }

        setIsWaitListLoading(true);
        getAllCourses({ courseIds }).then((courses) => {
            setWaitListedCourses(courses);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setIsWaitListLoading(false);
        });
    }

    const getEnrolledCourses = () => {
        if(!student) {
            return;
        }
        setIsEnrolledLoading(true);
        getStudentEnrollment({studentId}).then((courses) => {
            setEnrolledCourses(courses);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setIsEnrolledLoading(false);
        });
    }

    const handleExpandEnrolled = () => {
        setIsEnrolledExpanded(!isEnrolledExpanded);
        if(enrolledCourses.length === 0) {
            getEnrolledCourses();
        }
    }

    const handleExpandWaitlist =  () => {
        setIsWaitlistExpanded(!isWaitlistExpanded);
        if(waitListedCourses.length === 0) {
            getWaitListedCourses();
        }
    }

    return (
        <>
         
            {!loading && student ? (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Enrolled Courses</h2>
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={handleExpandEnrolled}
                        >
                            {isEnrolledLoading ? <span className="loading loading-spinner"></span> : isEnrolledExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>

                    {isEnrolledExpanded && (
                        <>
                            <div className="flex justify-between space-x-36">
                                <label className="grow input input-bordered input-info flex items-center gap-2">
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
                                        className={`btn join-item ${filters.Upcoming ? "btn-info" : ""}`}
                                        onClick={() => toggleFilter("Upcoming")}
                                    >
                                        Upcoming
                                    </button>
                                    <button
                                        className={`btn join-item ${filters.InProgress ? "btn-info" : ""}`}
                                        onClick={() => toggleFilter("InProgress")}
                                    >
                                        In Progress
                                    </button>
                                    <button
                                        className={`btn join-item ${filters.Completed ? "btn-info" : ""}`}
                                        onClick={() => toggleFilter("Completed")}
                                    >
                                        Completed
                                    </button>
                                </div>
                            </div>
                            
                            <CourseList
                                courses={enrolledCourses}
                                hrefSuffix="/course"
                            />

                           
                            <div className="flex justify-between">
                                <button 
                                    className="btn btn-info btn-sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>
                                <button 
                                    className="btn btn-info btn-sm"
                                    disabled={enrolledCourses.length < limit}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="border-b border-info"></div>
                        </>
                    )}



                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Waitlisted Courses</h2>
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={handleExpandWaitlist}
                        >
                            { isWaitListLoading? <span className="loading loading-spinner"></span> : isWaitlistExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>
                    
                    {isWaitlistExpanded && (
                 
                        <CourseList
                            courses={waitListedCourses}
                            hrefSuffix="/course"
                        />
               
                    )}
                </>
            ) : !student && !loading ? (
                <h1>Student not found</h1>
            ) : (
                <div className="w-full flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
        </>
    )
}

export default UserStudentHistory;