import { IBaseRating } from '../../base-types/base-rating.type';
import { Product } from '../schemas/product.schema';
import { User } from '../schemas/user.schema';

export interface IRating extends IBaseRating {
    _id: string;
    user?: User;
    product?: Product;
}
