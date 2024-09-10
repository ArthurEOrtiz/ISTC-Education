interface Certification {
    certificationId: number;
    studentId: number;
    certificationType: 'Appraiser' | 'Mapping';
    requestedDate: Date;
    reviewDate: Date | null;
    isApproved: boolean;
    approvedBy: number | null;
}