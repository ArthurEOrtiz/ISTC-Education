import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

interface AddRemoveClassProps {
    course: Course;
    setCourse: Dispatch<SetStateAction<Course | null>>;
}

const AddRemoveClass: React.FC<AddRemoveClassProps> = ({ course, setCourse }) => {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [start, setStart] = useState<string>('09:00:00');
    const [end, setEnd] = useState<string>('17:00:00');
    const [errors, setErrors] = useState<FormError>({});

    useEffect(() => {
        if (course.classes.length > 0) {
            const lastClass = course.classes[course.classes.length - 1];
            const date = new Date(lastClass.date);
            date.setDate(date.getDate() + 1);
            setDate(date.toISOString().split('T')[0]);
            setStart(lastClass.start);
            setEnd(lastClass.end);
        } 
    }, [course]);

    const handleAddClass = () => {
        const newClass: Class = {
            classId: 0,
            courseId: course?.courseId ?? 0,
            date,
            start,
            end,
        };

        setCourse({
            ...course, 
            classes: [ ...course.classes, newClass ]
        });
    }

    const handledChangeDate = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        // First get all the classes and update the date of the class at the given index
        const newClasses = course.classes.map((cls, i) => {
            if (i === index) {
                return { ...cls, date: e.target.value };
            }

            return cls;
        });

        // Then sort the classes by date
        newClasses.sort((a, b) => {
            if (a.date > b.date) {
                return 1;
            } else if (a.date < b.date) {
                return -1;
            } else {
                return 0;
            }
        });

        setCourse({
            ...course,
            classes: newClasses
        });
    }

    const handleTimChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { id, value } = e.target;
        //append :00 to the time value
        const time = value + ":00";
        const newClasses = course.classes.map((cls, i) => {
            if (i === index) {
                return { ...cls, [id]: time };
            }

            return cls;
        });

        setCourse({
            ...course,
            classes: newClasses
        });
    }

    const handleTimeValidation = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { id, value } = e.target;
        const newErrors = { ...errors };

        if (id === "start") {
            if (value > course.classes[index].end) {
                newErrors[index] = "Start time cannot be greater than end time";
            } else {
                newErrors[index] = "";
            }
        } else if (id === "end") {
            if (value < course.classes[index].start) {
                newErrors[index] = "End time cannot be less than start time";
            } else {
                newErrors[index] = "";
            }
        }

        setErrors(newErrors);
    }
   

    const handleRemoveClass = (index: number) => {
        const newClasses = course.classes.filter((cls, i) => i !== index);
        setCourse({
            ...course,
            classes: newClasses
        });
    }

    return (
        <>
            {course.classes.length > 0 ? (
                course.classes.map((cls, index) => (
                    <div className={`border ${errors[index] ? 'border-error' : 'border-info'} rounded-md p-2 mt-2`} key={index}>
                        <div className="grow space-y-2">
                            <div className="flex justify-between">
                                <h3 className="text-lg">Class {index + 1}</h3>
                                <button 
                                    className="btn btn-error btn-circle btn-xs dark:text-white"
                                    onClick={(() => handleRemoveClass(index))}
                                >
                                    <FaTimes/>
                                </button>
                            </div>
                            <div className="sm:flex sm:justify-between sm:gap-1 space-y-2 items-end">
                                <label className="input input-bordered flex items-center gap-2">
                                    <p className="font-bold text-xl">Date:</p>
                                    <input
                                        className="grow"
                                        type = "date"
                                        value={cls.date}
                                        onChange={(e) => {handledChangeDate(e, index)}}
                                    />
                        
                                </label>
                                <label className="input input-bordered flex items-center gap-2 ">
                                    <p className="font-bold text-xl">Start:</p>
                                    <input
                                        className="grow"
                                        type="time"
                                        id="start"
                                        value={cls.start}
                                        onChange={(e) => handleTimChange(e, index)}
                                        onBlur={(e) => handleTimeValidation(e, index)}  
                                    />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <p className="font-bold text-xl">End:</p>
                                    <input
                                        className="grow"
                                        type="time"
                                        id="end"
                                        value={cls.end}
                                        onChange={(e) => handleTimChange(e, index)}
                                        onBlur={(e) => handleTimeValidation(e, index)}
                                    />
                                </label>
                            </div>
                            {errors[index] && <p className="text-error">{errors[index]}</p>}
                        </div>
                  
                    </div>
                ))
            ) : (
                <div className="mt-1">
                    <h2 className="text-error">No classes have been added</h2>
                </div>
            )}

            <div className="flex justify-end mt-2">
                <button 
                    className="btn btn-success dark:text-white"
                    onClick={handleAddClass}
                >
                    <FaPlus /> Class
                </button>
            </div>
        </>
    )

}

export default AddRemoveClass;
    

    

