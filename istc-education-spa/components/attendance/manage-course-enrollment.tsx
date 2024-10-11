'use client';
import { getCourseEnrollments, getCourseWaitlist } from "@/utils/api/courses";
import { getAllUsers } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import UserList from "./user-list";
import { dropStudent, enrollStudents } from "@/utils/api/student";
import ModalBase from "../modal/modal-base";
import { Course } from "@/types/models/course";

interface ManageCourseEnrollmentProps {
    course: Course;
}

const ManageCourseEnrollment: React.FC<ManageCourseEnrollmentProps> = ({ course }) => {
    const [ error, setError ] = useState<string | null>(null);
    const [ enrolledUsers, setEnrolledUsers ] = useState<User[]>([]);
    const [ loadingEnrolledUsers, setLoadingEnrolledUsers ] = useState<boolean>(true);
    const [ users, setUsers ] = useState<User[]>([]);
    const [ loadingUsers, setLoadingUsers ] = useState<boolean>(true);
    const [ waitlistUsers, setWaitlistUsers ] = useState<User[]>([]);
    const [ saving, setSaving ] = useState<boolean>(false); 
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ loadingWaitlistUsers, setLoadingWaitlistUsers ] = useState<boolean>(true);
    const [ isWaitlistExpanded, setIsWaitlistExpanded ] = useState<boolean>(true);
    const [ isStudentsExpanded, setIsStudentsExpanded ] = useState<boolean>(true);
    const [ page, setPage ] = useState<number>(1);
    const [ limit ] = useState<number>(5);
    const [ search , setSearch ] = useState<string >("");
    const [ query ] = useDebounce(search, 500);
    const router = useRouter();
    

    useEffect(() => {
        setLoadingEnrolledUsers(true);
        setLoadingWaitlistUsers(true);
        getCourseEnrollments(course.courseId).then((users) => {
            setEnrolledUsers(users);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoadingEnrolledUsers(false);
        });

        getCourseWaitlist(course.courseId).then((users) => {
            setWaitlistUsers(users);
            if (users.length === 0) {
                setIsWaitlistExpanded(false);
            }
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoadingWaitlistUsers(false);
        });
    }, []);

    useEffect(() => {
        setLoadingUsers(true);
        getAllUsers({page, limit, search:query}).then((users) => {
            setUsers(users);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoadingUsers(false);
        });
    }, [page, query]);

    const handleSaveEnrollment = () => {
   
        const studentIds = enrolledUsers.map(u => u.student?.studentId);
       
        if (!studentIds || studentIds.length === 0) {
            setError("No students to enroll.");
            return;
        }
        
        setSaving(true);
        enrollStudents(course.courseId, studentIds as number[]).then((response) => {
            if (response.success) {
                setWaitlistUsers(waitlistUsers.filter(u => !studentIds.includes(u.student?.studentId)));
                setSuccess(true);
            } else {
                setError(response.error as string);
            }
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setSaving(false);
        });
    }
    
    return (
        <>
            <div className="w-full max-w-2xl space-y-2">
                <h2 className="text-2xl font-bold">Enrolled Students</h2>
                <div className="space-y-2">
                    <UserList
                        users={enrolledUsers}
                        enrollments={enrolledUsers}
                        loading={loadingEnrolledUsers}
                        onClick={(u) => setEnrolledUsers(enrolledUsers.filter(user => user.userId !== u.userId))}
                        add={false}
                        nullText="No students enrolled"
                    />

                    <div className="border-b"/>
                    <h3 className={`font-bold ${enrolledUsers.length >= course.maxAttendance ? 'text-error' : ''}`}>
                        {`${enrolledUsers.length} of ${course.maxAttendance} enrolled`}
                    </h3>
                </div>

                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Waitlist</h2>
                    <button 
                        className="btn btn-ghost btn-circle text-3xl"
                        onClick={() => setIsWaitlistExpanded(!isWaitlistExpanded)}>
                            {isWaitlistExpanded ? <FaAngleDown/> : <FaAngleUp/>}
                    </button>
                </div>
                {isWaitlistExpanded && (
                    <div className="space-y-2">
                        <UserList
                            users={waitlistUsers}
                            enrollments={enrolledUsers}
                            loading={loadingWaitlistUsers}
                            onClick={(user) => setEnrolledUsers([...enrolledUsers, user])}
                            add={true}
                            nullText="No students in waitlist"
                        />
                    </div>
                )}
        
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Students</h2>
                    <button 
                        className="btn btn-ghost btn-circle text-3xl"
                        onClick={() => setIsStudentsExpanded(!isStudentsExpanded)}>
                            {isStudentsExpanded ? <FaAngleDown/> : <FaAngleUp/>}
                    </button>
                </div>
                {isStudentsExpanded && (
                    <>
                        <label className="input input-bordered input-info flex items-center gap-2">
                            <input 
                                type="text" 
                                className="grow" 
                                placeholder="Search students . . . " 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <FaSearch/>
                        </label>
                        <div className="space-y-2 mt-2">
                            <UserList
                                users={users}
                                enrollments={enrolledUsers}
                                loading={loadingUsers}
                                onClick={(u) => setEnrolledUsers([...enrolledUsers, u])}
                                add
                                nullText="No students found"
                            />
                        </div>
                        {users.length > 0 && (
                            <div className="flex justify-between mt-2">
                                <button 
                                    className="btn btn-sm btn-info"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>
                                <button 
                                    className="btn btn-sm btn-info"
                                    disabled={users.length < limit}
                                    onClick={() => setPage(page + 1)}
                                    >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
                <div className="border-b "/>

                <div className="w-full flex justify-between"> 
                    <button 
                        className="btn btn-info"
                        onClick={() => router.back()}>
                            Back
                    </button>

                    <button
                        className="btn btn-success dark:text-white"
                        onClick={handleSaveEnrollment}
                        >
                            {saving ? <span className="loading loading-spinner"></span> : "Save"}
                    </button>
                </div>
            </div>
            <ModalBase
                title="Error"
                width="w-1/2"
                isOpen={error !== null}
                onClose={() => setError(null)}
                >
                <p>{error}</p>
            </ModalBase>
            <ModalBase
                title="Success"
                width="w-1/2"
                isOpen={success}
                onClose={() => setSuccess(false)}
                >
                 <p>Students have been successfully enrolled in the course.</p>
            </ModalBase>
        </>
    );






}

export default ManageCourseEnrollment;