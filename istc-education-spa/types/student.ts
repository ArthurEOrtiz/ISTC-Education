interface Student {
    studentId: number;
    userId: number;
    appraiserCertified: boolean;
    mappingCertified: boolean;
    certifications?: Certification[];
    attendances?: Attendance[];
    exams?: Exam[];
    waitLists?: WaitList[];
}
