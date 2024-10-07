'use client';
import { Topic } from "@/types/models/topic";
import React, { useState } from "react";
import TopicForm from "./topic-form";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { deleteTopic, putTopic } from "@/utils/api/topic";
import { useRouter } from "next/navigation";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Course } from "@/types/models/course";
import AddRemoveCourse from "./topic-add-remove-course";
import LoadingCourse from "@/app/course/loading";

interface EditTopicProps {
    topic: Topic;
}

const EditTopic: React.FC<EditTopicProps> = ({ topic: incomingTopic }) => {
    const [ topic, setTopic ] = useState<Topic>(incomingTopic);
    

    const [ errors, setErrors ] = useState<string | ErrorResponse | null>(null);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ deleting, setDeleting ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const [ deleted, setDeleted ] = useState<boolean>(false);

    const [ infoExpanded, setInfoExpanded ] = useState<boolean>(true);
    const [ courseExpanded, setCourseExpanded ] = useState<boolean>(false);
    
    const router = useRouter();

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await putTopic(topic);
            if (response.success) {
                setSuccess(true);
            } else {
                setErrors(response.error ?? 'An unexpected error occurred');
            }
        } catch (error) {
            setErrors("An unexpected while updating the topic");
        } finally {
            setSubmitting(false);
        }
    }

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await deleteTopic(topic.topicId);
            if (response.success) {
                router.push('/topic/edit');
                router.refresh();
            } else {
                setErrors(response.error ?? 'An unexpected error occurred');
            }
        } catch (error) {
            setErrors("An unexpected while updating the topic");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>  
            <div className="w-full max-w-xl space-y-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Edit Topic</h1>
                    <button
                        className="btn btn-ghost btn-circle text-3xl"
                        onClick={() => setInfoExpanded(!infoExpanded)}
                    >
                        {infoExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                    </button>
                </div>
                <div className={`${infoExpanded ? 'block' : 'hidden'}`}>
                    <TopicForm
                        topic={topic}
                        setTopic={setTopic}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Courses</h1>
                    <button
                        className="btn btn-ghost btn-circle text-3xl"
                        onClick={() => setCourseExpanded(!courseExpanded)}
                    >
                        {courseExpanded ? <FaAngleUp/> :  <FaAngleDown/>}
                    </button>
                </div>
                <div className={`${courseExpanded ? 'block' : 'hidden'}`}>
                    <AddRemoveCourse
                        topic={topic}
                        setTopic={setTopic}
                    />
                </div>
                <div className="border-b"/>
                <div className="flex justify-between">
                    <button
                        className="btn btn-info"
                        onClick={() => router.push('/topic/edit')}
                    >
                        Back
                    </button>
                    <div className="flex space-x-2">
                        <button
                            className="btn btn-error dark:text-white"
                            onClick={() => setDeleted(true)}
                        >
                            Delete
                        </button>
                        <button
                            className="btn btn-success dark:text-white"
                            onClick={handleSubmit}
                        >
                            {submitting ? <span className="loading loading-spinner"></span> : 'Save'}
                        </button>
                    </div>
                </div>
                

            </div>

            {deleted && (
                <ModalBase
                    title="Delete Topic"
                    width="w-1/2"
                    isOpen={deleted}
                    onClose={() => setDeleted(false)}
                >
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Are you sure you want to delete this topic?</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-success dark:text-white"
                                onClick={() => setDeleted(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error dark:text-white"
                                onClick={handleDelete}
                            >
                                {deleting ? <span className="loading loading-spinner"></span> : 'Delete'}
                            </button>
                        </div>
                    </div>
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
                        <h2 className="text-xl font-bold">Topic updated successfully</h2>
                        <div className="flex flex-row justify-end space-x-2">
                            <button
                                className="btn btn-info"
                                onClick={() => router.push('/admin')}
                            >
                                Admin Dashboard
                            </button>
                            <button 
                                className="btn btn-success dark:text-white"
                                onClick={() => router.push('/topic/edit')}
                            >
                                Back to Topics
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
    );
}

export default EditTopic;