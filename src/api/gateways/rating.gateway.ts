import { RatingService } from '../../bl/services/rating.service';
import { Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ transports: ['websocket'] })
export class RatingGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly _ratingService: RatingService) {}

    @SubscribeMessage('last-ratings')
    sendLastRatings(): void {
        this.server.emit('last-ratings', 'Test');
    }
}
