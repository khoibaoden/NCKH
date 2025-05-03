import { User } from '../user.model';

export interface UserCurrent extends User {
    status: any;
    data: any;
    username: string;
    isRefreshToken: boolean;
    roleNames: string[];
}
