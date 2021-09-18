import { ApiProperty } from '@nestjs/swagger';

export class LastRatingDto {
    @ApiProperty({ description: 'Last rating ID', required: true })
    id: string;

    @ApiProperty({ description: 'User name rating belongs to', example: 'TestUser' })
    userName: string;

    @ApiProperty({ description: 'Product name rating belongs to', example: 'TestProduct' })
    productName: string;

    @ApiProperty({ description: 'Creation date', example: new Date() })
    createdAt: Date;

    @ApiProperty({ description: 'Has last rating been deleted', example: false })
    isDeleted: boolean;
}
