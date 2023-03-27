import { User } from '../../../user/models/user.model';

export interface UserState {
  isAuth: boolean;
  user: User | null;
}

export const initialUserState: UserState = {
  isAuth: false,
  user: null,
};
