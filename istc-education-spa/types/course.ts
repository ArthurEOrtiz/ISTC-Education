interface Course {
    courseId: number;
    status: 'UpComing' | 'InProgress' | 'Archived';
    title: string; // Required
    description: string | null;
    attendanceCredit: number; // Required
    maxAttendance: number; // Required
    enrollmentDeadline: Date;
    instructorName: string  // Required
    instructorEmail: string | null;
    hasExam: boolean;
    examCredit: number | null;
    hasPDF: boolean;
    location: Location | null;
    pdf: PDF | null;
    topics: Topic[] | null;
    exams: Exam[] | null;
    classes: Class[] | null;
    waitList: WaitList[] | null;
}