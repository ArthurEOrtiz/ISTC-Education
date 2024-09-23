interface Student {
    studentId: number;
    userId: number;
    appraiserCertified: boolean;
    mappingCertified: boolean;
    accumulatedCredits: number;
    certifications?: Certification[];
    attendances?: Attendance[];
    exams?: Exam[];
    waitLists?: WaitList[];
}
