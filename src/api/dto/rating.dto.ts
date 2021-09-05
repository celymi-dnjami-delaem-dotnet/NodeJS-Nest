import { ApiProperty } from '@nestjs/swagger';
import { CreateRatingDto } from './create-rating.dto';
import { IsNotEmpty } from 'class-validator';

export class RatingDto extends CreateRatingDto {
    @ApiProperty({ description: 'Rating ID', required: true })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has rating been deleted', example: false })
    isDeleted: boolean;
}
