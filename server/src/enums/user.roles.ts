export enum UserRole {
  ROOT_ADMIN = 'ROOT_ADMIN',
  ADMIN = 'ADMIN',
  PREMIUM = 'PREMIUM',
  BASIC = 'BASIC'
}

export const isAdmin = (role: UserRole): boolean => {
  return role === UserRole.ADMIN || role === UserRole.ROOT_ADMIN;
};

export const isRootAdmin = (role: UserRole): boolean => {
  return role === UserRole.ROOT_ADMIN;
};

export const isPremium = (role: UserRole): boolean => {
  return role === UserRole.PREMIUM;
}; 