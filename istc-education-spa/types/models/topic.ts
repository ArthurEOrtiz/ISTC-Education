import { Course } from "./course";

export interface Topic {
    topicId: number;
    title: string;
    created?: Date;
    description: string | null;
    courses?: Course[];
}