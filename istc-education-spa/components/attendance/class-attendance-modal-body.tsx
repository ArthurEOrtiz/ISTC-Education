import { useState } from "react";

interface ClassAttendanceModalBodyProps {
    cls: Class;
}

const ClassAttendanceModalBody: React.FC<ClassAttendanceModalBodyProps> = ({ cls }) => {
    const [students, setStudents] = useState<Student[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingStudents, setLoadingStudents] = useState<boolean>(false);

    


    return (
        <div>
           <h2>Class Attendance</h2>
        </div>
    );
}

export default ClassAttendanceModalBody;

