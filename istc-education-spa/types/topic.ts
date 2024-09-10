interface Topic {
    topicId: number;
    title: string;
    description: string | null;
    courses: Course[];
}