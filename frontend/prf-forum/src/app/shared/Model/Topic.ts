export interface Topic {
    _id: string;
    author: string;
    title: string;
    timestamp: Date;
    comments: Comment[];
    usersLikesTopic: string;
}