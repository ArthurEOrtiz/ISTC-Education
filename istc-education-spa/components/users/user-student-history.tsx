"use client";

import { Course } from "@/types/models/course";
import { getAllCourses } from "@/utils/api/courses";
import { getStudents } from "@/utils/api/student";
import { convertDateToMMDDYYYY } from "@/utils/global-functions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface UserStudentHistoryProps {
    studentId: number | undefined;
}

const UserStudentHistory: React.FC<UserStudentHistoryProps> = ({ studentId }) => {

    const [ student, setStudent ] = useState<Student | null>();
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string | null>(null);
    
    const [ inProgressCourses, setInProgressCourses ] = useState<Course[]>([]); 
    const [ completedCourses, setCompletedCourses ] = useState<Course[]>([]);
    const [ upcomingCourses, setUpcomingCourses ] = useState<Course[]>([]);
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
   
   
    const getWaitListedCourses = () => {
        const courseIds = student && student.waitLists ? student.waitLists.map((waitList) => waitList.courseId) : undefined; 
        
        if (!courseIds) {
            return;
        }

        console.log("CourseIds: ", courseIds);
        setIsWaitListLoading(true);
        getAllCourses({ courseIds }).then((courses) => {
            setWaitListedCourses(courses);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setIsWaitListLoading(false);
        });
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
                        <h2 className="text-2xl font-bold">Waitlisted Courses</h2>
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={handleExpandWaitlist}
                        >
                            { isWaitListLoading? <span className="loading loading-spinner"></span> : isWaitlistExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>
                    
                    {isWaitlistExpanded && (
                        <div className="space-y-2">
                            {waitListedCourses.map((course) => {
                                const { enrollmentDeadline, classes} = course;
                                const deadline = convertDateToMMDDYYYY(enrollmentDeadline);
                                const firstDayofClass = classes.length > 0 ? convertDateToMMDDYYYY(classes[0].date) : "";

                                return (
                                    <div key={course.courseId} className="border border-info rounded-md p-2">
                                        <Link href={`/course/${course.courseId}`}>
                                            <h3 className="text-lg font-bold">{course.title}</h3>
                                            <div className="flex gap-2">
                                                <p className="font-bold">Enrollment Deadline:</p>
                                                <p>{deadline}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <p className="font-bold">Start Date:</p>
                                                <p>{firstDayofClass}</p>
                                            </div>
                                            
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : !student && !loading ? (
                <h1>Student not found</h1>
            ) : (
                <div className="w-full flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            <pre>{JSON.stringify(student, null, 2)}</pre>
        </>
    )
}

export default UserStudentHistory;