import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class AuditUtils {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  /**
   * Get current user ID from request context
   * This can be extended to work with your authentication system
   */
  getCurrentUserId(): string {
    // Check if user is authenticated and get user ID
    // This is a placeholder - implement based on your auth system
    if (this.request?.user?.id) {
      return this.request.user.id;
    }
    
    // Check for user ID in headers (for API calls)
    if (this.request?.headers?.['x-user-id']) {
      return this.request.headers['x-user-id'];
    }
    
    // Default fallback
    return 'system';
  }

  /**
   * Get current user ID or default value
   */
  getCurrentUserIdOrDefault(defaultValue: string = 'system'): string {
    const userId = this.getCurrentUserId();
    return userId !== 'system' ? userId : defaultValue;
  }
}
