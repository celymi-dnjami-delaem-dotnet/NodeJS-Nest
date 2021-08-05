import { IBaseDb } from '../../db/types/base-db.type';
import { Category as MongoCategory } from '../../db/mongo/schemas/category.schema';
import { Category as PostgresCategory } from '../../db/postgres/entities/category.entity';
import { ServiceResultType } from '../result-wrappers/service-result-type';
import { UserFriendlyException } from '../exceptions/user-friendly.exception';

export class Utils {
    static validateServiceResultType(serviceResultType: ServiceResultType, exceptionMessage?: string): void {
        if (serviceResultType !== ServiceResultType.Success) {
            throw new UserFriendlyException(serviceResultType, exceptionMessage);
        }
    }

    static isSchema(schema: IBaseDb): schema is MongoCategory {
        return '_id' in schema;
    }

    static isEntity(entity: IBaseDb): entity is PostgresCategory {
        return 'id' in entity;
    }
}
