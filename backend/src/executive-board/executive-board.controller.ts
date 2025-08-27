import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ExecutiveBoardService } from './executive-board.service';
import { CreateExecutiveBoardDto } from './dto/create-executive-board.dto';
import { UpdateExecutiveBoardDto } from './dto/update-executive-board.dto';
import { ExecutiveBoardResponseDto } from './dto/executive-board-response.dto';
import { ExecutiveBoardQueryDto } from './dto/executive-board-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('executive-board')
@Controller('executive-board')
export class ExecutiveBoardController {
  constructor(private readonly executiveBoardService: ExecutiveBoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new executive board member',
    description: 'Create a new member in the executive board'
  })
  @ApiResponse({
    status: 201,
    description: 'Executive board member created successfully',
    type: ExecutiveBoardResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Position already taken',
  })
  async create(@Body() createExecutiveBoardDto: CreateExecutiveBoardDto): Promise<ExecutiveBoardResponseDto> {
    return this.executiveBoardService.create(createExecutiveBoardDto);
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Get executive board list',
    description: 'Get all executive board members with optional filters'
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by unit or other information' })
  @ApiQuery({ name: 'position_title', required: false, description: 'Filter by position title' })
  @ApiQuery({ name: 'is_active', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'sort_by', required: false, description: 'Sort order (asc/desc)' })
  @ApiResponse({
    status: 200,
    description: 'Executive board list',
    type: [ExecutiveBoardResponseDto],
  })
  async findAll(@Query() query: ExecutiveBoardQueryDto): Promise<ExecutiveBoardResponseDto[]> {
    return this.executiveBoardService.findAll(query);
  }

  @Get('position/:positionTitle')
  @ApiOperation({ 
    summary: 'Get members by position',
    description: 'Get members list by specific position'
  })
  @ApiParam({ name: 'positionTitle', description: 'Position to search for' })
  @ApiResponse({
    status: 200,
    description: 'Members by position',
    type: [ExecutiveBoardResponseDto],
  })
  async findByPosition(@Param('positionTitle') positionTitle: string): Promise<ExecutiveBoardResponseDto[]> {
    return this.executiveBoardService.findByPosition(positionTitle);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get executive board member by ID',
    description: 'Get detailed information of an executive board member'
  })
  @ApiParam({ name: 'id', description: 'Executive board member ID' })
  @ApiResponse({
    status: 200,
    description: 'Executive board member information',
    type: ExecutiveBoardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Executive board member not found',
  })
  async findOne(@Param('id') id: string): Promise<ExecutiveBoardResponseDto> {
    return this.executiveBoardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update executive board member',
    description: 'Update information of an executive board member'
  })
  @ApiParam({ name: 'id', description: 'Executive board member ID' })
  @ApiResponse({
    status: 200,
    description: 'Executive board member updated successfully',
    type: ExecutiveBoardResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Executive board member not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Position already taken',
  })
  async update(
    @Param('id') id: string, 
    @Body() updateExecutiveBoardDto: UpdateExecutiveBoardDto
  ): Promise<ExecutiveBoardResponseDto> {
    return this.executiveBoardService.update(id, updateExecutiveBoardDto);
  }



  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete executive board member',
    description: 'Delete (hide) an executive board member'
  })
  @ApiParam({ name: 'id', description: 'Executive board member ID' })
  @ApiResponse({
    status: 200,
    description: 'Executive board member deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Executive board member deleted successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Executive board member not found',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.executiveBoardService.remove(id);
  }
}
