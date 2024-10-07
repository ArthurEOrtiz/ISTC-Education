import { getAllTopics } from "@/utils/api/topic";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import ModalBase from "../modal/modal-base";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Course } from "@/types/models/course";
import { Topic } from "@/types/models/topic";
import { useDebounce } from "use-debounce";

interface CourseAddRemoveTopicProps {
    course: Course;
    setCourse: Dispatch<SetStateAction<Course>>;
}

const AddRemoveTopics: React.FC<CourseAddRemoveTopicProps> = ({ course, setCourse }) => {
    const [ topics, setTopics ] = useState<Topic[] | null>(null);
    const [ search , setSearch ] = useState<string>("");
    const [ query ] = useDebounce(search, 500);
    const [ page, setPage ] = useState<number>(1);
    const limit = 10;
    const [ error, setError ] = useState<string | null>(null);
    const [ loadingTopics, setLoadingTopics ] = useState<boolean>(false);
    const [ searching, setSearching ] = useState<boolean>(false);
    const [ navToNext, setNavToNext ] = useState<boolean>(false);
    const [ navToPrev, setNavToPrev ] = useState<boolean>(false);
    const [ selectTopicModal, setSelectTopicModal ] = useState<boolean>(false);

    useEffect(() => {
        setSearching(true);
        getAllTopics(page, limit, query).then( topics => {
            setTopics(topics);
        }).catch( error => {
            setError("Error fetching topics");
        }).finally(() => {
            setSearching(false);
        });
    }, [query]);

    useEffect(() => {
        getAllTopics(page, limit, query).then( topics => {
            setTopics(topics);
        }).catch( error => {
            setError("Error fetching topics");
        }).finally(() => {
            setNavToNext(false);
            setNavToPrev(false);
        })
    }, [page]);

    const handleOpenModal = async () => {
        setLoadingTopics(true);
        const topics = await getAllTopics(page, limit);
        if (topics) {
            setTopics(topics);
        } else {
            setError("Error fetching topics");
        }
        setLoadingTopics(false);
        setSelectTopicModal(true);
    }

    const handleAddTopic = (topic: Topic) => {
        if (course.topics) {
            setCourse({
                ...course,
                topics: [...course.topics, topic]
            });
        } else {
            setCourse({
                ...course,
                topics: [topic]
            });
        }
    }

    const handleRemoveTopic = (topicId: number) => {
        const newTopics = course.topics?.filter( topic => topic.topicId !== topicId);
        setCourse({
            ...course,
            topics: newTopics
        });
    }

    const handleDisableAddButton = (topic: Topic): boolean => {
        return course.topics?.find( t => t.topicId === topic.topicId) ? true : false
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
            {course.topics && course.topics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                    {course.topics.map( (topic) => (
                        <div key={topic.topicId} className="bg-info p-2 rounded-md">
                            <div className="flex justify-between gap-2">
                                <p>{topic.title}</p>
                                <button 
                                    className="btn btn-error btn-circle btn-xs dark:text-white"
                                    onClick={() => handleRemoveTopic(topic.topicId)}
                                >
                                    <FaTimes/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-error-content rounded-md p-4 mt-1">
                    <h2 className="text-error font-bold">No topics have been added</h2>
                </div>
            )}
            <div className="flex justify-end mt-2">
                <button 
                    className="btn btn-sm btn-success dark:text-white"
                    onClick={handleOpenModal}
                    >
                    {loadingTopics ? <span className="loading loading-spinner"></span> : <><FaPlus/> Topic</>}  
                </button>
            </div>
            {selectTopicModal && 
                <ModalBase 
                    title="Select Topics" 
                    width="w-full max-w-lg"
                    isOpen={selectTopicModal} 
                    onClose={() => setSelectTopicModal(false)}
                >
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold">Selected Topics</h3>
                        <div className='border-b'/>
                        <div className="flex flex-wrap gap-2">
                            {course.topics && course.topics.length > 0 ? (
                                course.topics.map( (topic) => (
                                    <div key={topic.topicId} className="bg-info p-2 rounded-md">
                                        <div className="flex justify-between gap-2">
                                            <p>{topic.title}</p>
                                            <button 
                                                className="btn btn-error btn-circle btn-xs dark:text-white"
                                                onClick={() => handleRemoveTopic(topic.topicId)}
                                            >
                                                <FaTimes/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full bg-error-content rounded-md p-4">
                                    <h2 className="text-error font-bold">No topics have been added</h2>
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
                                    placeholder="Search for topics"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </label>
                        </div>
                        <h3 className="text-lg font-bold">Topics</h3>
                        <div className='border-b'/>
                        <div className="mt-1 space-y-2">
                            {topics && topics.length > 0 ? (
                                <div className="space-y-2 overflow-y-auto max-h-96">
                                    
                                    {topics.map( topic => (
                                        <div key={topic.topicId} className="flex gap-2 items-center">
                                            <p>{topic.title}</p>
                                            <button 
                                                className="btn btn-success btn-circle btn-xs dark:text-white"
                                                onClick={() => handleAddTopic(topic)}
                                                disabled={handleDisableAddButton(topic)}
                                                >
                                                    <FaPlus />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-error-content rounded-md p-4">
                                    <h2 className="text-error font-bold">No topics found</h2>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <button 
                                    className={`btn btn-sm ${page === 1 ? 'btn-disabled' : 'btn-info'}`}
                                    onClick={handleNavToPrev}
                                    disabled={page === 1}
                                >
                                    {navToPrev ? <span className="loading loading-spinner"></span> : "Previous"}
                                </button>
                                <button 
                                    className={`btn btn-sm ${topics && topics.length < limit ? 'btn-disabled' : 'btn-info'}`}
                                    onClick={handleNavToNext}
                                    disabled={topics != null && topics.length < limit}
                                >
                                    {navToNext ? <span className="loading loading-spinner"></span> : "Next"}
                                </button>
                            </div>
                            <div className='border-b'/>
                            <div className="flex justify-end mt-2">
                                <button 
                                    className="btn btn-sm btn-success dark:text-white"
                                    onClick={() => setSelectTopicModal(false)}
                                >
                                    Done
                                </button>
                            </div>
                        
                        </div>
                    </div>
                </ModalBase>          
            }

            {error &&
                <ModalBase
                    title="Error"
                    isOpen={error ? true : false}
                    onClose={() => setError(null)}
                >
                    <div className="bg-error-content p-4 rounded-md">
                        <h2 className="text-error font-bold">{error}</h2>
                    </div>
                </ModalBase>
            }

        </>
    )
}

export default AddRemoveTopics;