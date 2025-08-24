import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/member/create-member.dto';
import { UpdateMemberDto } from './dto/member/update-member.dto';
import { MemberResponseDto } from './dto/member/member-response.dto';
import { RegisterMemberDto } from './dto/member/register-member.dto';
import { RegisterMemberResponseDto } from './dto/member/register-member-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

// Helper function to validate UUID
function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new member (creates both user and member)' })
  @ApiBody({ type: RegisterMemberDto })
  @ApiResponse({
    status: 201,
    description: 'Member registered successfully',
    type: RegisterMemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User with email or phone already exists',
  })
  async register(
    @Body() registerMemberDto: RegisterMemberDto,
  ): Promise<RegisterMemberResponseDto> {
    return this.memberService.registerMember(registerMemberDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new member' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({
    status: 201,
    description: 'Member created successfully',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<MemberResponseDto> {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'List of all members',
    type: [MemberResponseDto],
  })
  async findAll(): Promise<MemberResponseDto[]> {
    return this.memberService.findAll();
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Get member by user ID' })
  @ApiParam({ name: 'user_id', description: 'User ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Member for the user',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found for this user',
  })
  async findByUser(
    @Param('user_id') user_id: string,
  ): Promise<MemberResponseDto | null> {
    if (!validateUUID(user_id)) {
      throw new BadRequestException('Invalid UUID format for user_id');
    }
    return this.memberService.findByUser(user_id);
  }

  @Get('company/:company_id')
  @ApiOperation({ summary: 'Get members by company ID' })
  @ApiParam({ name: 'company_id', description: 'Company ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'List of members for the company',
    type: [MemberResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  async findByCompany(
    @Param('company_id') company_id: string,
  ): Promise<MemberResponseDto[]> {
    if (!validateUUID(company_id)) {
      throw new BadRequestException('Invalid UUID format for company_id');
    }
    return this.memberService.findByCompany(company_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member by ID' })
  @ApiParam({ name: 'id', description: 'Member ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Member found',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  async findOne(@Param('id') id: string): Promise<MemberResponseDto> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for member ID');
    }
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update member by ID' })
  @ApiParam({ name: 'id', description: 'Member ID (UUID)' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({
    status: 200,
    description: 'Member updated successfully',
    type: MemberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format or input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for member ID');
    }
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete member by ID' })
  @ApiParam({ name: 'id', description: 'Member ID (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Member deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for member ID');
    }
    return this.memberService.remove(id);
  }
}
