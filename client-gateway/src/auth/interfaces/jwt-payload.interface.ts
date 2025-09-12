/**
 * Interface that defines the structure of the JWT payload
 * used for authentication and authorization
 */
export interface JwtPayload {
  /** User ID (subject) */
  sub: number;
  /** User email address */
  email: string;
  /** User full name */
  name: string;
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * Interface for the validated user object
 * returned by the JWT strategy
 */
export interface ValidatedUser {
  userId: number;
  email: string;
  name: string;
}
