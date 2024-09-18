interface Course {
    courseId: number;
    status: 'UpComing' | 'InProgress' | 'Completed' | 'Archived' | 'Cancelled'; // Required
    title: string; // Required
    description: string | null;
    attendanceCredit: number; // Required
    maxAttendance: number; // Required
    enrollmentDeadline: string; // Required // date only
    instructorName: string  // Required
    instructorEmail: string | null;
    hasExam: boolean;
    examCredit: number | null;
    hasPDF: boolean;
    location: Location;
    pdf?: PDF;
    topics?: Topic[];
    exams?: Exam[];
    classes: Class[];
    waitList?: WaitList[];
}