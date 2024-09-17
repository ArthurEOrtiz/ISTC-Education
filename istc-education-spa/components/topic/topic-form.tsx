import { validateLength } from "@/utils/forms/validation";
import { ChangeEvent, useEffect, useState } from "react";
import TextInput from "../form/text-input";
import TextAreaInput from "../form/textarea-input";
import { useRouter } from "next/navigation";

interface TopicFormProps {
    topic?: Topic;
    submitText: string;
    goBack?: boolean;
    onSubmit: (topic: Topic) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ topic:incomingTopic, submitText, goBack, onSubmit }) => {
    const [ topic, setTopic ] = useState<Topic>({
        topicId: 0,
        title: "",
        description: null,
    });

    const [ errors, setErrors ] = useState<FormError>({});
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (incomingTopic) {
            setTopic(incomingTopic);
        }
    }, [incomingTopic]);

    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(topic);
    }

    useEffect(() => {
        const formErrors = Object.values(errors);
        setIsFormValid(formErrors.every(error => error === '') && requiredFieldsFilled());
    }, [topic, errors]); 
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.target;

        if (id === "description" && value === "") { 
            setTopic({ ...topic, description: null });
            return;
        }
        setTopic({ ...topic, [id]: value });
    }

    const handdleValidation = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const formErrors: FormError = {};
        const { id, value } = e.target;
        

        switch (id) {
            case 'title':
                formErrors[id] = validateLength(value, 3, 50) ? '' : 'Title must be between 3 and 50 characters';
                break;
            case 'description':
                formErrors[id] = value === '' ? '' : validateLength(value, 3, 500) ? '' : 'Description must be between 3 and 500 characters';
                break;
        }

        setErrors(prev => ({
            ...prev,
            [id]: formErrors[id]
        }));
    }

    const requiredFieldsFilled  = (): boolean => {
        if (topic.title.length === 0) {
            return false;
        }

        return true;
    }

    return (
        <form onSubmit={handleOnSubmit} className="max-w-xl space-y-2">
            <TextInput
                id="title"
                label="Title"
                defaultValue={topic.title}
                onChange={handleOnChange}
                onBlur={handdleValidation}
                error={errors.title}
                required
            />
            <TextAreaInput
                id="description"
                placeholder="Description"
                defaultValue={topic.description || ''}
                onChange={handleOnChange}
                onBlur={handdleValidation}
                error={errors.description}
            />
            <div className="flex justify-end gap-2">
                {goBack && (
                    <button
                        type="button"
                        className="btn btn-error dark:text-white"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-success dark:text-white"
                    disabled={!isFormValid}
                >
                    {submitText}
                </button>
            </div>
        </form>
    );
}

export default TopicForm;

    





