import { Course } from "@/types/models/course";
import { Topic } from "@/types/models/topic";
import Link from "next/link";
import  React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import ModalBase from "../modal/modal-base";
import { getAllCourses } from "@/utils/api/courses";
import { useDebounce } from "use-debounce";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface AddRemoveCourseProps {
    topic: Topic;
    setTopic: Dispatch<SetStateAction<Topic>>;
}

const AddRemoveCourse: React.FC<AddRemoveCourseProps> = ({ topic, setTopic }) => {
    const [ courses, setCourses ] = useState<Course[]>([]);
    const [ loadingCourses, setLoadingCourses ] = useState<boolean>(false);
    const [ selectCourseModal, setSelectCourseModal ] = useState<boolean>(false);

    const [ search, setSearch ] = useState<string>('');
    const [ query ] = useDebounce(search, 500);
    const [ page, setPage ] = useState<number>(1);
    const limit = 5;
    const [ searching, setSearching ] = useState<boolean>(false);
    const [ navToNext, setNavToNext ] = useState<boolean>(false);
    const [ navToPrev, setNavToPrev ] = useState<boolean>(false);

    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        setSearching(true);
        getAllCourses({ page, limit, search: query }).then(response => {
            setCourses(response);
        }).catch(error => {
            setError(error.message);
        }).finally(() => {
            setSearching(false);
        });
    }, [query]);

    useEffect(() => {
        getAllCourses({ page, limit, search:query }).then(response => {
            setCourses(response);
        }).catch(error => {
            setError(error.message);
        }).finally(() => {
            setNavToNext(false);
            setNavToPrev(false);
        });
    }, [page]);

    const handleOpenModal = async () => {
        setLoadingCourses(true);
        getAllCourses({ page, limit }).then(response => {
            setCourses(response);
        }).catch(error => {
            setError(error.message);
        }).finally(() => {
            setLoadingCourses(false);
            setSelectCourseModal(true);
        });
    }

    const handleAddCourse = async (course: Course) => {
        if (topic.courses?.find(c => c.courseId === course.courseId)) {
            return;
        }

        if (topic.courses) {
            setTopic({
                ...topic,
                courses: [...topic.courses, course]
            });
        } else {
            setTopic({
                ...topic,
                courses: [course]
            });
        }
    }

    const handleRemoveCourse = async (course: Course) => {
        setTopic({
            ...topic,
            courses: topic.courses?.filter(c => c.courseId !== course.courseId)
        });
    }

    const handleDisableAddButton = (course: Course): boolean => {
        return !!topic.courses?.find(c => c.courseId === course.courseId);
    }

    const handleNavToNext = async () => {
        setNavToNext(true);
        setPage(page + 1);

    }

    const handleNavToPrev = async () => {
        setNavToPrev(true);
        setPage(page - 1);
    }

    return (
        <>
            <div className="space-y-2">
            {topic.courses?.map((course, index) => (
                    <div
                        key={index}
                        className="border border-info rounded-md p-2">
                        <div className="flex justify-between">
                            <div>
                                <Link href={`/course/edit/${course.courseId}`}>
                                    <h3 className="text-lg font-semibold">{course.title}</h3>
                                </Link>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setTopic({
                                            ...topic,
                                            courses: topic.courses?.filter(c => c.courseId !== course.courseId)
                                        });
                                    }}
                                    className="btn btn-error btn-circle btn-xs dark:text-white">
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button 
                        className="btn btn-sm btn-success dark:text-white"
                        onClick={handleOpenModal}
                        >
                       {loadingCourses ? <span className="loading loading-spinner"></span> : <><FaPlus/> Course</>}
                    </button>
                </div>
            </div>
            <ModalBase
                title="Select Course"
                width="w-full max-w-lg"
                isOpen={selectCourseModal}
                onClose={() => setSelectCourseModal(false)}
            >
                <div className="space-y-2">
                    <h2 className="text-lg font-bold">Selected Course</h2>
                    <div className="border-b"/>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                        {topic.courses && topic.courses.length > 0 ? (
                            topic.courses?.map((course, index) => (
                                <div
                                key={index}
                                className="border border-info rounded-md p-2">
                                    <div className="flex justify-between">
                                        <div>
                                            <Link href={`/course/edit/${course.courseId}`}>
                                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                            </Link>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleRemoveCourse(course)}
                                                className="btn btn-error btn-circle btn-xs dark:text-white">
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-error-content rounded-md p-4">
                                <h2 className="text-error font-bold">No courses selected</h2>
                            </div>
                        )}
                    </div>
                    <div className='border-b'/>
                    <div>
                        <label className="input input-bordered flex items-center gap-2">
                            {searching ? <span className="loading loading-dots"></span> : <FaMagnifyingGlass/>}
                            <input 
                                type="text" 
                                className="grow" 
                                placeholder="Search for courses"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                    </div>
                    <h3 className="text-lg font-bold">Courses</h3>
                    <div className="border-b"/>
                    <div className="space-y-2">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <div
                                    key={index}
                                    className="border border-info rounded-md p-2">
                                    <div className="flex justify-between">
                                        <div>
                                            <Link href={`/course/edit/${course.courseId}`}>
                                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                            </Link>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() =>handleAddCourse(course)}
                                                disabled={handleDisableAddButton(course)}
                                                className="btn btn-success btn-circle btn-xs dark:text-white">
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (   
                            <div className="bg-error-content rounded-md p-4">
                                <h2 className="text-error font-bold">No courses found</h2>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <button 
                            className={`btn btn-sm ${page === 1 ? 'btn-disabled' : 'btn-info'}`}
                            onClick={handleNavToPrev}
                            disabled={page === 1}
                        >
                            {navToPrev ? <span className="loading loading-spinner"></span> : "Previous"}
                        </button>
                        <button 
                            className={`btn btn-sm ${courses.length < limit ? 'btn-disabled' : 'btn-info'}`}
                            onClick={handleNavToNext}
                            disabled={courses.length < limit}
                        >
                            {navToNext ? <span className="loading loading-spinner"></span> : "Next"}
                        </button>
                    </div>
                    <div className="border-b"/>
                    <div className="flex justify-end">
                        <button
                            className="btn btn-sm btn-success dark:text-white"
                            onClick={() => setSelectCourseModal(false)}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </ModalBase>
        </>
    );
}

export default AddRemoveCourse;