import { getAttendance, updateAttendance } from "@/utils/api/attendance";
import { getCourseEnrollments } from "@/utils/api/courses";
import { useEffect, useState } from "react";

interface ClassAttendanceModalBodyProps {
    cls: Class;
    onClose: () => void;    
}

const ClassAttendanceModalBody: React.FC<ClassAttendanceModalBodyProps> = ({ cls, onClose }) => {
    const [enrolledUsers, setEnrolledUsers] = useState<User[] | null>(null);
    const [errors, setErrors] = useState<ErrorResponse | string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false); 
    const [attendances, setAttendances] = useState<Attendance[] | undefined>(undefined);


    useEffect(() => {
        getStudents();
        getAttendance(cls.classId).then((response) => {
            setAttendances(response);
        }).catch((error) => {
            setErrors(error.message);
        });
    }, []);

    const getStudents = async () => {
        setLoading(true);
        getCourseEnrollments(cls.courseId).then((response) => {
            setEnrolledUsers(response);
        }).catch((error) => {
            setErrors(error.message);
        }).finally(() => {
            setLoading(false);
        });
    }

     
    
    const handleSelectStudent = (user: User) => {
        setAttendances((attendances) => {
            return attendances?.map((a) => {
                if (a.studentId === user.student?.studentId) {
                    return {
                        ...a,
                        hasAttended: !a.hasAttended
                    };
                }
                return a;
            });
        });
    };

    const handleSelectAll = () => {
        if (attendances?.every((a) => a.hasAttended)) {
            setAttendances((attendances) => {
                return attendances?.map((a) => {
                    return {
                        ...a,
                        hasAttended: false
                    };
                });
            });
        } else {
            setAttendances((attendances) => {
                return attendances?.map((a) => {
                    return {
                        ...a,
                        hasAttended: true
                    };
                });
            });
        }
    }


    const isStudentAttended = (user: User): boolean => { 
        return attendances?.find((a) => a.studentId === user.student?.studentId)?.hasAttended ?? false;
    };

    const handleSave = async () => {
        setLoading(true);
        updateAttendance(attendances!).then((response) => {
            if (response.success) {
                setErrors(undefined);

            } else {
                setErrors(response.error);
            }
        }).catch((error) => {
            setErrors(error.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            {errors && (
                <p className="text-error">
                    {Array.isArray(errors) ? errors.join(', ') : typeof errors === 'string' ? errors : JSON.stringify(errors)}
                </p>
            )}
            <div className="flex justify-between items-center border-b py-2">
                <p className="text-warning">Select All</p>
                <input 
                    type="checkbox" 
                    className="checkbox checkbox-info"
                    checked={attendances?.every((a) => a.hasAttended)}
                    onChange={handleSelectAll}
                />
            </div>
            {enrolledUsers && enrolledUsers.map((user, index) => (
                <div 
                    key={index}
                    className="flex justify-between items-center border-b py-2"    
                >
                    <p>{user.firstName} {user.lastName}</p>
                    <input 
                        type="checkbox" 
                        className="checkbox checkbox-info"
                        checked={isStudentAttended(user)}
                        onChange={() => handleSelectStudent(user)} 
                    />
                </div>
            ))}
            <div className="flex justify-end gap-2 mt-2">
                <button 
                    className="btn btn-error dark:text-white"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button 
                    className="btn btn-success dark:text-white"
                    disabled={loading}
                    onClick={handleSave}
                >
                    {loading ? <span className="loading loadin-spinner"></span>: 'Save'}
                </button>
            </div>
            
           
        </div>
    );
}

export default ClassAttendanceModalBody;

