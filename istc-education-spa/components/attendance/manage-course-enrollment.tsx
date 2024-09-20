'use client';
import { getCourseEnrollments, getCourseWaitlist } from "@/utils/api/courses";
import { getAllUsers } from "@/utils/api/users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { useDebounce } from "use-debounce";

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
    const [ loadingWaitlistUsers, setLoadingWaitlistUsers ] = useState<boolean>(true);
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
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoadingWaitlistUsers(false);
        });
    }, []);

    useEffect(() => {
        setLoadingUsers(true);
        getAllUsers(page, limit, query).then((users) => {
            setUsers(users);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoadingUsers(false);
        });
    }, [page, query]);
    
    const handleRemoveUserFromEnrolled = (userId: number) => {
        setEnrolledUsers(enrolledUsers.filter(user => user.userId !== userId));
    }

    const handleEnrollUser = (user: User) => {
        setEnrolledUsers([...enrolledUsers, user]);
    }

    const handleDisabledEnrollButton = (user: User): boolean => {
        return enrolledUsers.some(u => u.userId === user.userId);
    }
    
    return (
        <div className="w-full max-w-2xl space-y-2">
            <div>
                <h2 className="text-2xl font-bold">Enrolled Students</h2>
                <div className="space-y-2">
                   {!loadingEnrolledUsers && enrolledUsers.length > 0 ? (
                        enrolledUsers.map((user, index) => (
                            <div key={index} className="border border-info rounded-md flex justify-between p-4">
                                <div className="flex gap-2">
                                    <p className="font-bold">{user.lastName}, {user.firstName} {user.middleName}</p>
                                    <p>{user.contact.email}</p>
                                </div>
                                <div>
                                    <button 
                                        className="btn btn-error btn-circle btn-sm dark:text-white"
                                        onClick={() => handleRemoveUserFromEnrolled(user.userId)}>
                                            <FaTimes/>
                                </button>
                                </div>
                            </div>
                        )
                    )
                    ) : !loadingEnrolledUsers && enrolledUsers.length === 0 ? (
                        <div className="bg-error-content p-4 rounded-md">
                            <p className="text-error">No students enrolled</p>
                        </div>
                    ) : (
                        <div className="flex justify-center">   
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}
                </div>
            </div>
            <div>
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
                            {!loadingUsers && users.length > 0 ? (
                                users.map((user, index) => (
                                    <div key={index} className="border border-info rounded-md flex justify-between p-4">
                                        <div className="flex gap-2">
                                            <p className="font-bold">{user.firstName} {user.lastName}</p>
                                            <p>{user.contact.email}</p>
                                        </div>
                                        <div>
                                            <button 
                                                className="btn btn-success btn-circle btn-sm dark:text-white"
                                                onClick={() => handleEnrollUser(user)}
                                                disabled={handleDisabledEnrollButton(user)}>
                                                    <FaPlus/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : !loadingUsers && users.length === 0 ? (
                                <div className="bg-error-content p-4 rounded-md">
                                    <p className="text-error">No students found</p>
                                </div>
                            ) : (
                                <div className="flex justify-center">   
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            )}
                        </div>
                        {users.length > 0 && (
                            <div className="flex justify-between mt-2">
                                <button 
                                    className="btn btn-info dark:text-white"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>
                                <button 
                                    className="btn btn-info dark:text-white"
                                    disabled={users.length < limit}
                                    onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                </button>
                            </div>
                        )}
                    </>
                )}

            </div>
            <div className="border-b" />
            <div className="w-full flex justify-end gap-2"> 
                <button 
                    className="btn btn-error dark:text-white"
                    onClick={() => router.back()}>
                        Back
                </button>
                <button 
                    className="btn btn-success dark:text-white"
                    >
                        Save Changes
                </button>
            </div>

        </div>
    );


}

export default ManageCourseEnrollment;