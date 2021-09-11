import { IBaseRating } from '../../base-types/base-rating.type';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

export interface IRating extends IBaseRating {
    id: string;
    user?: User;
    product?: Product;
}
