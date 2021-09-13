import { RatingService } from '../../bl/services/rating.service';
import { Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class RatingGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly _ratingService: RatingService) {}

    @SubscribeMessage('last-ratings')
    async sendLastRatings(): Promise<void> {
        const lastRatings = await this._ratingService.getTopLastRatings(10);

        this.server.emit('last-ratings', lastRatings);
    }
}
