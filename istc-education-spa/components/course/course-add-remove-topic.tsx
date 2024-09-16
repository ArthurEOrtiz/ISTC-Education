import { Dispatch, SetStateAction } from "react";

interface CourseAddRemoveTopicProps {
    course: Course;
    setCourse: Dispatch<SetStateAction<Course | null>>;
}

const AddRemoveTopics: React.FC<CourseAddRemoveTopicProps> = ({ course, setCourse }) => {
    return (
        <>
            {course.topics ? (
                <div className="space-y-2">
                   
                </div>
            ) : (
                <div className="mt-1">
                    <h2 className="text-error">No topics have been added</h2>
                </div>
            )}
        </>
    )
}

export default AddRemoveTopics;