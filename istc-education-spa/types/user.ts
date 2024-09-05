export interface User {
    userId: number;
    ipId?: string;
    status: 'Active' | 'Archived';
    firstName: string;
    lastName: string;
    middleName?: string;
    isAdmin: boolean;
    isStudent: boolean;
    contact?: Contact;
    employer?: Employer;
    student?: Student;
}

