interface Class {
    classId: number;
    courseId: number;
    scheduleStart: Date;
    scheduleEnd: Date;
    attendances?: Attendance[];
}