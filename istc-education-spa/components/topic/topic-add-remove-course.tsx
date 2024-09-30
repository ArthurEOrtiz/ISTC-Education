import { Topic } from "@/types/models/topic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CourseList from "../course/course-list";
import { Course } from "@/types/models/course";
import { getAllCourses } from "@/utils/api/courses";

interface AddRemoveCourseProps {
    topic: Topic;
    setTopic: Dispatch<SetStateAction<Topic>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    expanded: boolean;  
}

const AddRemoveCourse: React.FC<AddRemoveCourseProps> = ({ topic, setTopic, loading, setLoading, expanded }) => {
    const [ courses, setCourses ] = useState<Course[]>([]);
    const [ error, setError ] = useState<string | null>(null);
    

    useEffect(() => {
        if (courses.length === 0 && expanded) {
            setLoading(true);
            getAllCourses({ topicIds: [topic.topicId] })
                .then(response => {
                    setCourses(response);
                    console.log(response);
                })
                .catch(() => setError('Error while fetching courses'))
                .finally(() => setLoading(false));
        }
    }, [expanded]);
        


    return (
        <>
            <h2>Courses</h2>         
            <CourseList hrefSuffix="/course" courses={courses} />
       
        </>
    );
}

export default AddRemoveCourse;