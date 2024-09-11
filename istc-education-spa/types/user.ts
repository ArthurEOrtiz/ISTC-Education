interface User {
    userId: number;
    ipId: string | null;
    status: 'Active' | 'Archived';
    firstName: string;
    lastName: string;
    middleName: string | null;
    isAdmin: boolean;
    isStudent: boolean;
    contact: Contact | null;
    employer: Employer | null;
    student: Student | null;
}

