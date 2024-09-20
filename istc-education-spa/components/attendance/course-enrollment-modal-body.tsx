'use client';
import { getCourseEnrollments } from "@/utils/api/courses";
import { getAllUsers } from "@/utils/api/users";
import { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

interface CourseEnrollmentModalBodyProps {
    course: Course;
    onError: (error: string) => void;  
}

const CourseEnrollmentModalBody: React.FC<CourseEnrollmentModalBodyProps> = ({ course, onError }) => {
    const [ error, setError ] = useState<string | null>(null);
    const [ enrolledUsers, setEnrolledUsers ] = useState<User[]>([]);
    const [ loadingEnrolledUsers, setLoadingEnrolledUsers ] = useState<boolean>(true);
    const [ users, setUsers ] = useState<User[]>([]);
    const [ loadingUsers, setLoadingUsers ] = useState<boolean>(true);

    useEffect(() => {
        setLoadingEnrolledUsers(true);
        getCourseEnrollments(course.courseId).then((users) => {
            setEnrolledUsers(users);
        }).catch((error) => {
            onError(error.message);
        }).finally(() => {
            setLoadingEnrolledUsers(false);
        });
    }, []);

    useEffect(() => {
        setLoadingUsers(true);
        getAllUsers(1,5).then((users) => {
            setUsers(users);
        }).catch((error) => {
            onError(error.message);
        }).finally(() => {
            setLoadingUsers(false);
        });
    }, []);
    
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
        <div>
            <div>
                <h2 className="text-2xl font-bold">Enrolled Students</h2>
                <div className="space-y-2 mt-2">
                   {!loadingEnrolledUsers && enrolledUsers.length > 0 ? (
                        enrolledUsers.map((user, index) => (
                            <div key={index} className="border border-info rounded-md flex justify-between p-4">
                                <div className="flex gap-2">
                                    <p className="font-bold">{user.firstName} {user.lastName}</p>
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
                        ))
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
                <h2 className="text-2xl font-bold">Students</h2>
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
            </div>

        </div>
    );


}

export default CourseEnrollmentModalBody;