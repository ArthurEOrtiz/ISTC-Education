'use client';
import { postTopic } from "@/utils/api/topic";
import { useState } from "react";
import ModalBase from "../modal/modal-base";
import { useRouter } from "next/navigation";
import TopicForm from "./topic-form";
import TopicInfo from "./topic-info";
import { Topic } from "@/types/models/topic";
import ErrorBody from "../modal/error-body";


const CreateTopic: React.FC = () => {
    const [ topic, setTopic ] = useState<Topic>({
        topicId: 0,
        title: "",
        description: null,
    });
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

    return (
        <>
            {step === 1 && (   
                <div className="w-full max-w-xl border border-info rounded-md p-4">
                    <TopicForm
                        submitText="Next"
                        goBack
                        topic={topic}
                        setTopic={setTopic}
                        onSubmit={() => setStep(2)}
                    />
                </div>
            )}
            {step === 2 && (
                <div className="border border-info max-w-2xl rounded-md p-4">
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
                            {saving ? <span className="loading loading-spinner"></span> : "Create Topic"}
                        </button>
                    </div>
                    {errors && (
                        <ModalBase
                            title="Error"
                            width="w-1/2"
                            isOpen={errors !== null}
                            onClose={() => setError(null)}
                        >
                            <ErrorBody errors={errors} />
                        </ModalBase>
                    )}
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
                                        Admin Dashboard
                                    </button>
                                    <button
                                        className="btn btn-success dark:text-white"
                                        onClick={() => {
                                            router.push('/topic/edit')
                                            router.refresh()    
                                        }}
                                    >
                                        Back to Topics
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
