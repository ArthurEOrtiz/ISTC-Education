'use client';
import { useState } from "react";
import CourseForm from "./course-form";
import AddRemoveClass from "./course-add-remove-class";
import AddRemoveTopics from "./course-add-remove-topic";
import { useRouter } from "next/navigation";
import { putCourse } from "@/utils/api/courses";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { convertDateToMMDDYYYY } from "@/utils/global-functions";
import ClassAttendanceModalBody from "../attendance/class-attendance-modal-body";
import { Course } from "@/types/models/course";

interface EditCourseProps {
    course: Course;
}

const EditCourse: React.FC<EditCourseProps> = ({ course:incomingCourse }) => {
    const [ course, setCourse ] = useState<Course>(incomingCourse);
    const [ errors, setErrors ] = useState<string | ErrorResponse | null>(null);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ infoExpanded, setInfoExpanded ] = useState<boolean>(false);
    const [ topicsExpanded, setTopicsExpanded ] = useState<boolean>(false);
    const [ classesExpanded, setClassesExpanded ] = useState<boolean>(false);
    const [ attendanceExpanded, setAttendanceExpanded ] = useState<boolean>(true);
    const [ archiveConfirmationModal, setArchiveConfirmationModal ] = useState<boolean>(false);
    const [ attendanceModal, setAttendanceModal ] = useState<boolean>(false);
    const [ selectedClass, setSelectedClass ] = useState<Class | null>(null);   
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const handleUpdateCourse = async () => {
        setSaving(true);
        try {
            const response = await putCourse(course);
            if (response.success) {
                setSuccess(true);
            } else {
                setErrors(response.error ?? "An unknown error occurred");
            }
        } catch (error) {
            setErrors("An error occurred while updating the course");
        } finally {
            setSaving(false);
        }
    }

    return(
        <>
            <div className="w-full max-w-2xl flex flex-col items-center">
                <div className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold">{course.title}</h2>
                    <div className="flex justify-between items-center gap-2">
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={() => setInfoExpanded(!infoExpanded)}
                        >
                            {infoExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>
                </div>
                <div className={`${infoExpanded ? "block" : "hidden"}`}>
                    <CourseForm
                        course={course}
                        setCourse={setCourse}
                        submitText="Update Information"
                    />
                </div>
                <div className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold">Topics</h2>
                    <div className="flex justify-between items-center gap-2">
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={() => setTopicsExpanded(!topicsExpanded)}
                        >
                            {topicsExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>
                </div>

                <div className={`w-full ${topicsExpanded ? "block" : "hidden"}`}>
                    <AddRemoveTopics course={course} setCourse={setCourse} />
                </div>

                <div className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold">Classes</h2>
                    <div className="flex justify-between items-center gap-2">
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={() => setClassesExpanded(!classesExpanded)}
                        >
                            {classesExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>
                </div>

                <div className={`w-full ${classesExpanded ? "block" : "hidden"}`}>
                    <AddRemoveClass course={course} setCourse={setCourse} />
                </div>

                <div className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold">Attendance</h2>
                    <div className="flex justify-between items-center gap-2">
                        <button 
                            className="btn btn-ghost btn-circle text-3xl"
                            onClick={() => setAttendanceExpanded(!attendanceExpanded)}
                        >
                            {attendanceExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                        </button>
                    </div>
                </div>

                <div className={`w-full ${attendanceExpanded ? "block" : "hidden"}`}>
                    {course.classes.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            <button 
                                className="btn btn-info"
                                onClick={() => router.push(`/course/enrollment/${course.courseId}`)}
                            >
                                Manage Enrollment
                            </button>
                            {course.classes.map((cls, index) => {
                                const date: string = convertDateToMMDDYYYY(cls.date);
                                return (
                                    <div key={index} className="border border-info rounded-md flex justify-between items-center p-4">
                                        <p className="text-xl">{date}</p>
                                        <button
                                            className="btn btn-info"
                                            onClick={() => {
                                                setAttendanceModal(true);
                                                setSelectedClass(cls);
                                            }}
                                        >
                                            View Attendance
                                        </button>
                                    </div>
                                );
                            }
                            )}
                        </div>
                    ) : (
                        <div className="bg-error-content rounded-md p-4">
                            <h2 className="text-error font-bold">No classes have been added</h2>
                        </div>
                    )}
                </div>
                
               
                <div className="w-full border-b my-2" />
                <div className="w-full flex justify-end gap-2">
                    <button 
                        className="btn btn-error dark:text-white"
                        onClick={() => router.back()}>
                            Back
                    </button>
                    <button 
                        className="btn btn-success dark:text-white"
                        onClick={handleUpdateCourse}
                        disabled={saving}
                        >
                            {saving ? <span className="loading loading-spinner"></span> : "Update Course"}
                    </button>
                    
                </div>
            </div>

            {attendanceModal && selectedClass && (
                <ModalBase
                    title="Attendance"
                    width="sm:w-1/4"
                    isOpen={attendanceModal}
                    onClose={() =>{
                        setAttendanceModal(false);
                        setSelectedClass(null)
                    }}
                >
                    <ClassAttendanceModalBody 
                        cls={selectedClass} 
                        onClose={() => {
                            setAttendanceModal(false);
                            setSelectedClass(null);
                        }}
                    />
                </ModalBase>  
            )}
            
            {success && (
                <ModalBase
                    title="Success"
                    width="w-1/2"
                    isOpen={success}
                    onClose={() => setSuccess(false)}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Course Updated Successfully</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => router.push('/course')}
                            >
                                Go to Courses
                            </button>
                            <button
                                className="btn btn-info dark:text-white"
                                onClick={() => router.push('/admin')}
                            >
                                Go to Admin Dashboard
                            </button>
                        </div>
                    </div>
                </ModalBase>
            )}
            {archiveConfirmationModal && (
                <ModalBase
                    title="Archive Course"
                    width="w-1/2"
                    isOpen={archiveConfirmationModal}
                    onClose={() => setArchiveConfirmationModal(false)}
                >
                    <div className="space-y-2">
                        <div>
                            <h2 className="font-bold">Are you sure you want to archive this course?</h2>
                            <p></p>
                            <p>This action cannot be undone!</p>
                        </div>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-error dark:text-white"
                                onClick={() => setCourse({...course, status: "Archived"})}
                            >
                                Archive
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={() => setArchiveConfirmationModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </ModalBase>
            )}
            {errors && (
                <ModalBase
                    title="Error"
                    width="w-1/2"
                    isOpen={errors !== null}
                    onClose={() => setErrors(null)}
                >
                    <ErrorBody errors={errors} />
                </ModalBase>
            )}
        </>
    )
}

export default EditCourse;