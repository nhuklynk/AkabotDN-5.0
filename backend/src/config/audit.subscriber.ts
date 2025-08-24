import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { BaseAuditEntity } from './base-audit.entity';

@Injectable()
export class AuditSubscriber implements EntitySubscriberInterface<BaseAuditEntity> {
  constructor(@InjectConnection() readonly connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return BaseAuditEntity;
  }

  beforeInsert(event: InsertEvent<BaseAuditEntity>) {
    const now = new Date();
    const entity = event.entity;
    
    // Set audit fields for new entities
    if (entity) {
      entity.created_at = now;
      entity.modified_at = now;
      
      // Set default values if not provided
      if (!entity.created_by) {
        entity.created_by = 'system';
      }
      if (!entity.modified_by) {
        entity.modified_by = entity.created_by;
      }
    }
  }

  beforeUpdate(event: UpdateEvent<BaseAuditEntity>) {
    const now = new Date();
    const entity = event.entity;
    
    // Update audit fields for existing entities
    if (entity) {
      entity.modified_at = now;
      
      // Keep the original created_by if not set
      if (!entity.modified_by) {
        entity.modified_by = entity.created_by || 'system';
      }
    }
  }
}
