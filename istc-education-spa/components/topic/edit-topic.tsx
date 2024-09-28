'use client';
import { Topic } from "@/types/models/topic";
import { useState } from "react";
import TopicForm from "./topic-form";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { deleteTopic, putTopic } from "@/utils/api/topic";
import { useRouter } from "next/navigation";

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
            <div className="space-y-2">
                <div className="w-full flex justify-end">
                    <button
                        className="btn btn-error btn-sm dark:text-white"
                        onClick={() => setDeleted(true)}
                    >
                        Delete
                    </button>
                </div>
                <TopicForm
                    topic={topic}
                    setTopic={setTopic}
                    submitText="Save"
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    goBack
                />
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