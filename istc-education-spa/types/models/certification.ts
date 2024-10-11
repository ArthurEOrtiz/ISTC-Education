interface Certification {
    certificationId: number;
    studentId: number;
    type: 'Appraiser' | 'Mapping';
    requestedDate: Date;
    reviewDate: Date | null;
    isApproved: boolean;
    approvedBy: number | null;
}