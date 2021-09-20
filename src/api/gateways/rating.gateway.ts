import { RatingDto } from '../dto/rating.dto';
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class RatingGateway {
    private static readonly lastRatingsEventName = 'last-ratings';

    @WebSocketServer()
    server: Server;

    sendLastRatings(lastRatings: RatingDto[]): void {
        this.server.emit(RatingGateway.lastRatingsEventName, lastRatings);
    }
}
