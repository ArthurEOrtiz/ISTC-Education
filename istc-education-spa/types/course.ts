interface Course {
    courseId: number;
    status: 'UpComing' | 'InProgress' | 'Archived';
    title: string;
    description: string | null;
    attendanceCredit: number;
    maxAttendance: number;
    enrollmentDeadline: Date;
    instructorName: string;
    instructorEmail: string;
    hasExam: boolean;
    hasPDF: boolean;
    location: Location | null;
    pdf: PDF | null;
    topics: Topic[] | null;
    exams: Exam[] | null;
    classes: Class[] | null;
    waitList: WaitList[] | null;
}