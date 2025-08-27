import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SearchService, SearchResult } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Search across all content types',
    description: 'Search posts, events, FAQs, and partners with full-text search capabilities'
  })
  @ApiQuery({ name: 'q', description: 'Search query string', required: true, type: String })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Maximum number of results per category', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Search results grouped by content type' })
  async search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SearchResult> {
    if (!query || query.trim().length === 0) {
      return {
        posts: [],
        events: [],
        faqs: [],
        partners: [],
        pagination: {
          posts: { page: 1, limit: 0, total: 0, totalPages: 0 },
          events: { page: 1, limit: 0, total: 0, totalPages: 0 },
          faqs: { page: 1, limit: 0, total: 0, totalPages: 0 },
          partners: { page: 1, limit: 0, total: 0, totalPages: 0 },
        },
      };
    }

    return this.searchService.searchAll(query.trim(), { 
      posts: { page, limit }, 
      events: { page, limit }, 
      faqs: { page, limit }, 
      partners: { page, limit } 
    });
  }
}
