interface Course {
    courseId: number;
    status: 'UpComing' | 'InProgress' | 'Archived';
    title: string;
    description?: string;
    attendanceCredit: number;
    maxAttendance: number;
    enrollmentDeadline: Date;
    instructorName: string;
    instructorEmail: string;
    hasExam: boolean;
    hasPDF: boolean;
    location?: Location;
    pdf?: PDF;
    topics?: Topic[];
    exams?: Exam[];
    classes?: Class[];
    waitList?: WaitList[];
}