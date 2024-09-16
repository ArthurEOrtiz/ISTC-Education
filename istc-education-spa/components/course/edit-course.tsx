'use client';
import { useState } from "react";
import CourseForm from "./course-form";
import AddRemoveClass from "./course-add-remove-class";

interface EditCourseProps {
    course: Course;
}

const EditCourse: React.FC<EditCourseProps> = ({ course:incomingCourse }) => {
    const [course, setCourse] = useState<Course>(incomingCourse);

    return(
        <>
            <CourseForm
                course={course}
                setCourse={setCourse}
                submitText="Update Information"
            />
            <div className="space-y-2 p-4">
                <h2 className="text-xl font-bold">Classes</h2>
                <div className="border-b" />
                <AddRemoveClass course={course} setCourse={setCourse as any} />
            </div>
        </>
    )
}

export default EditCourse;