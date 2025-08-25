import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../user/dto/user/user-response.dto';
import { MemberResponseDto } from './member-response.dto';

export class RegisterMemberResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Member registered successfully'
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: 'Created member information with roles',
    type: MemberResponseDto
  })
  @Expose()
  @Type(() => MemberResponseDto)
  member: MemberResponseDto;

  constructor(partial: Partial<RegisterMemberResponseDto>) {
    Object.assign(this, partial);
  }
}
