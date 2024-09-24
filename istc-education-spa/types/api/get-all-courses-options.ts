import { CourseStatus } from "../models/course";

export interface GetAllCoursesOptions {
    page?: number;
    limit?: number;
    statuses?: CourseStatus[]; 
    startDate?: Date;
    endDate?: Date;
    search?: string;
}