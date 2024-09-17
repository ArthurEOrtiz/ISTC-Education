'use client';
import { postTopic } from "@/utils/api/topic";
import { useEffect, useState } from "react";
import ModalBase from "../modal/modal-base";
import ErrorBody from "../modal/error-body";
import { useRouter } from "next/navigation";
import TopicForm from "./topic-form";
import TopicInfo from "./topic-info";
import { FaTrash } from "react-icons/fa";

const CreateTopic: React.FC = () => {
    const [ topic, setTopic ] = useState<Topic | null>(null);
    const [ step, setStep ] = useState<number>(1);
    const [ errors, setError ] = useState<string | ErrorResponse | null>(null);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ success, setSuccess ] = useState<boolean>(false);
    const router = useRouter();

    const createTopic = async () => {
        if (topic) {
            setSaving(true);
            try {
                const response = await postTopic(topic);
                if (response.success) {
                    setSuccess(true);
                } else {
                    setError(response.error ?? "An unknown error occurred");
                }
            } catch (error) {
                setError("An error occurred while creating the topic");
            } finally {
                setSaving(false);
            }
        }
    }

    const handleTopicFormSubmit = (topic: Topic) => {
        setTopic(topic);
        setStep(2);
    }

    return (
        <>
            {step === 1 && (   
                <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/3 border border-info rounded-md p-4">
                    <TopicForm
                        submitText="Next"
                        goBack
                        topic={topic || undefined}
                        onSubmit={handleTopicFormSubmit}
                    />
                </div>
            )}
            {step === 2 && topic && (
                <div className="border border-info sm:w-1/3 rounded-md p-4">
                    <div className="p-4">
                        <TopicInfo topic={topic} />
                    </div>
                    <div className="flex justify-between gap-2 p-4">
                        <button
                            className="btn btn-error dark:text-white"
                            onClick={() => setStep(1)}
                        >
                            Back
                        </button>
                        <button
                            className="btn btn-success dark:text-white"
                            onClick={createTopic}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Create Topic"}
                        </button>
                    </div>
                    {success && (
                        <ModalBase
                            title="Topic Created"
                            width="w-1/2"
                            isOpen={success}
                            onClose={() => {}}
                        >
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold">Course Created Successfully</h2>
                                <div className="flex justify-between">
                                    <button
                                        className="btn btn-success dark:text-white"
                                        onClick={() => router.push('/admin')}
                                    >
                                        Go to Admin Dashboard
                                    </button>
                                    <button
                                        className="btn btn-success dark:text-white"
                                        onClick={() => router.push('/topic')}
                                    >
                                        Go to Topics
                                    </button>
                                </div>
                            </div>
                        </ModalBase>
                    )}
                </div>
            )}
        </>
    );
}

export default CreateTopic;
