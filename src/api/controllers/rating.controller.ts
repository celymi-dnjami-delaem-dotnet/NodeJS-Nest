import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { ApiRequest } from '../types';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CollectionSearchGuard } from '../guards/collection-search.guard';
import { ControllerTags } from '../../configuration/swagger.configuration';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { DefaultRoles } from '../../bl/constants';
import { RatingDto } from '../dto/rating.dto';
import { RatingService } from '../../bl/services/rating.service';
import { RolesGuard } from '../guards/role.guard';

@ApiTags(ControllerTags.Ratings)
@Controller('api/ratings')
export class RatingController {
    constructor(private readonly _ratingService: RatingService) {}

    @UseGuards(new RolesGuard([DefaultRoles.Admin]), CollectionSearchGuard)
    @Get()
    @ApiBearerAuth()
    @ApiImplicitQuery({ name: 'limit', required: false, type: Number })
    @ApiImplicitQuery({ name: 'offset', required: false, type: Number })
    @ApiOkResponse({ type: [RatingDto], description: 'OK' })
    async getRatings(@Query('limit') limit?: string, @Query('offset') offset?: string): Promise<RatingDto[]> {
        return this._ratingService.getRatings(limit, offset);
    }

    @UseGuards(new RolesGuard([DefaultRoles.Buyer, DefaultRoles.Admin]))
    @Get('id/:id')
    @ApiBearerAuth()
    @ApiOkResponse({ type: RatingDto, description: 'OK' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async getRatingById(@Req() request: ApiRequest): Promise<RatingDto> {
        return this._ratingService.getRatingById(request.params.id, request.user.userId, request.user.roles);
    }

    @UseGuards(new RolesGuard([DefaultRoles.Buyer, DefaultRoles.Admin]))
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: RatingDto, description: 'Created' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async setRating(@Body() createRatingDto: CreateRatingDto): Promise<RatingDto> {
        return this._ratingService.setRating(createRatingDto);
    }

    @UseGuards(new RolesGuard([DefaultRoles.Buyer, DefaultRoles.Admin]))
    @Delete('soft-remove/id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async softRemoveCategory(@Req() request: ApiRequest): Promise<void> {
        await this._ratingService.softRemoveRating(request.params.id, request.user.userId, request.user.roles);
    }

    @UseGuards(new RolesGuard([DefaultRoles.Buyer, DefaultRoles.Admin]))
    @Delete('id/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: 'No Content' })
    @ApiNotFoundResponse({ description: 'Not Found' })
    async removeCategory(@Req() request: ApiRequest): Promise<void> {
        await this._ratingService.removeRating(request.params.id, request.user.userId, request.user.roles);
    }
}
