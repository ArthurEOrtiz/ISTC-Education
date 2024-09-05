interface Certification {
    certificationId: number;
    studentId: number;
    certificationType: 'Appraiser' | 'Mapping';
    requestedDate: Date;
    reviewDate?: Date;
    isApproved: boolean;
    approvedBy?: number;
}