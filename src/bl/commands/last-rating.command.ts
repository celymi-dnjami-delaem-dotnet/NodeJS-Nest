import { ICreateLastRatingCommand } from './create-last-rating.command';

export interface ILastRatingCommand extends ICreateLastRatingCommand {
    id?: string;
    createdAt: Date;
    isDeleted: boolean;
}
