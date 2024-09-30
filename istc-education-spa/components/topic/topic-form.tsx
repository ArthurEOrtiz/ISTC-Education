import { validateLength } from "@/utils/forms/validation";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import TextInput from "../form/text-input";
import TextAreaInput from "../form/textarea-input";
import { useRouter } from "next/navigation";
import { Topic } from "@/types/models/topic";

interface TopicFormProps {
    topic: Topic;
    setTopic: Dispatch<SetStateAction<Topic>>;
    submitText?: string;
    submitting?: boolean;
    goBack?: boolean;
    onSubmit?: (topic: Topic) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ topic, setTopic, submitText, submitting = false, goBack, onSubmit }) => {
    const [ errors, setErrors ] = useState<FormError>({});
    const [ isFormValid, setIsFormValid ] = useState<boolean>(false);
    const router = useRouter();

    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit && onSubmit(topic);
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
                {submitText && (
                    <button
                        type="submit"
                        className="btn btn-success dark:text-white"
                        disabled={!isFormValid || submitting}
                    >
                        {submitting ? <span className="loading loading-spinner"></span> : submitText}
                    </button>
                )}
            </div>
        </form>
    );
}

export default TopicForm;

    





