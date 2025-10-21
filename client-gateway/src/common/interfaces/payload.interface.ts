export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface PayloadInterface {
  sub: number;
  email: string;
  name: string;
  role: UserRole;
}
