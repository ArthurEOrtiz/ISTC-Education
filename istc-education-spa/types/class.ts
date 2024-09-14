interface Class {
    classId: number;
    courseId: number;
    date: Date,
    start: string,
    end: string,
    attendances?: Attendance[];
}