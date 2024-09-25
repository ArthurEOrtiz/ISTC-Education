import { CourseStatus } from "../models/course";


export interface GetStudentEnrollmentOptions {
    page?: number;
    limit?: number;
    search?: string;
    statuses?: CourseStatus[];
    studentId: number;
}