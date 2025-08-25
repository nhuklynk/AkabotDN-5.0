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
  Query,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/member/create-member.dto';
import { UpdateMemberDto } from './dto/member/update-member.dto';
import { MemberResponseDto } from './dto/member/member-response.dto';
import { MemberQueryDto } from './dto/member-query.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
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
  @ApiOperation({ summary: 'Get all members with pagination and search' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts from 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for member name or email',
  })
  @ApiQuery({
    name: 'company_id',
    required: false,
    description: 'Filter by company ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by membership status',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of members',
  })
  async findAll(
    @Query() query: MemberQueryDto,
  ): Promise<PaginatedData<MemberResponseDto>> {
    return this.memberService.searchAndPaginate(query);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all members without pagination (for internal use)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all members',
    type: [MemberResponseDto],
  })
  async findAllMembers(): Promise<MemberResponseDto[]> {
    return this.memberService.findAll();
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Get members by user ID' })
  @ApiParam({ name: 'user_id', description: 'User ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'List of members for the user',
    type: [MemberResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  async findByUser(
    @Param('user_id') user_id: string,
  ): Promise<MemberResponseDto[]> {
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
