import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
    getProducts(): any {
        return [
            {
                displayName: 'Cyberpunk 2077',
                price: '60$',
                rating: 2.7,
            },
            {
                displayName: 'SpongeBob SquarePants: Battle for Bikini Bottom – Rehydrated',
                price: '40$',
                rating: 9.8,
            },
            {
                displayName: 'God Of War',
                price: '50$',
                rating: 8.6,
            },
        ];
    }
}
