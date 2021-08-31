import { createHash } from 'crypto';

export class UserUtils {
    static hashPassword(password: string): string {
        return createHash('sha256').update(password).digest('hex');
    }
}
