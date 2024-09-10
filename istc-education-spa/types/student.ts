interface Student {
    studentId: number;
    userId: number;
    appraiserCertified: boolean;
    mappingCertified: boolean;
    certifications: Certification[] | null;
    attendances: Attendance[] | null;
    exams: Exam[] | null;
    waitLists: WaitList[] | null;
}
