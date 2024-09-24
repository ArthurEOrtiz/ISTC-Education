interface Class {
    classId: number;
    courseId: number;
    date: string, // date only
    start: string, // time only
    end: string, // time only
    attendances?: Attendance[];
}