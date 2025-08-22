

export class UserResponseDto {
  userId: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  status: string;
  roles: Array<{
    roleId: string;
    roleName: string;
    description?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
