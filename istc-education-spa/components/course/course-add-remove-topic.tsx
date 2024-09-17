import { getAllTopics } from "@/utils/api/topic";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import ModalBase from "../modal/modal-base";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface CourseAddRemoveTopicProps {
    course: Course;
    setCourse: Dispatch<SetStateAction<Course>>;
}

const AddRemoveTopics: React.FC<CourseAddRemoveTopicProps> = ({ course, setCourse }) => {
    const [ topics, setTopics ] = useState<Topic[] | null>(null);
    const [ filteredTopics, setFilteredTopics ] = useState<Topic[] | null>(null);
    const [ error, setError ] = useState<string | null>(null);
    const [ loadingTopics, setLoadingTopics ] = useState<boolean>(false);
    const [ selectTopicModal, setSelectTopicModal ] = useState<boolean>(false);


    const handleOpenModal = async () => {
        setLoadingTopics(true);
        const topics = await getAllTopics();
        if (topics) {
            setTopics(topics);
            setFilteredTopics(topics);
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

    const handleSearchTopics = (search: string) => {
        if (search === "") {
            setFilteredTopics(topics);
        } else {
            const searchResults = topics ? topics.filter( topic => topic.title.toLowerCase().includes(search.toLowerCase())) : null;
            setFilteredTopics(searchResults);
        }
    }

    const handleDisableAddButton = (topic: Topic): boolean => {
        return course.topics?.find( t => t.topicId === topic.topicId) ? true : false
    }

    const getTopics = async () => {
        const topics = await getAllTopics();
        if (topics) {
            setTopics(topics);
        } else {
            setError("Error fetching topics");
        }
    }

    return (
        <>
            {course.topics && course.topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
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
                    className="btn btn-success dark:text-white"
                    onClick={handleOpenModal}
                    >
                    {loadingTopics ? <span className="loading loading-spinner"></span> : <><FaPlus/> Topic</>}  
                </button>
            </div>
            {selectTopicModal && filteredTopics &&
                <ModalBase 
                    title="Select Topics" 
                    width="w-2/5"
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
                                <FaMagnifyingGlass />
                                <input 
                                    type="text" 
                                    className="grow" 
                                    placeholder="Search for topics"
                                    onChange={(e) => handleSearchTopics(e.target.value)}
                                />
                            </label>
                        </div>
                        <h3 className="text-lg font-bold">Topics</h3>
                        <div className='border-b'/>
                        <div className="mt-1 space-y-2">
                            {filteredTopics && filteredTopics.length > 0 ? (
                                <div className="space-y-2 overflow-y-auto max-h-96">
                                    
                                    {filteredTopics.map( (topic) => (
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
                            ) :(
                                <div className="bg-error-content rounded-md p-4">
                                    <h2 className="text-error font-bold">No topics found</h2>
                                </div>
                            )}
                            {error && <p className="text-error">{error}</p>}
                        </div>
                    </div>
                </ModalBase>          
            }  

        </>
    )
}

export default AddRemoveTopics;