import { ActiveUserData } from './active-user-data.interface';

export interface RequestWithUser extends Request {
  user: ActiveUserData;
}
