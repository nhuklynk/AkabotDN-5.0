import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { MediaModule } from './media/media.module';
import { MemberModule } from './member/member.module';
import { FaqModule } from './faq/faq.module';
import { PartnerModule } from './partner/partner.module';
import { PostViewModule } from './post-view/post-view.module';
import { EventModule } from './event/event.module';
import { ExecutiveBoardModule } from './executive-board/executive-board.module';
import { AuditSubscriber } from './config/audit.subscriber';
import { CommonModule } from './common/common.module';
import { StorageModule } from './storage/storage.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SwaggerExportController } from './config/swagger-export.controller';
import { APP_GUARD } from '@nestjs/core';
import { GlobalJwtAuthGuard } from './auth/guards/global-jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    CommonModule,
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    TagModule,
    CommentModule,
    MediaModule,
    MemberModule,
    FaqModule,
    PartnerModule,
    PostViewModule,
    EventModule,
    ExecutiveBoardModule,
    StorageModule,
    SubscriptionModule,
  ],
  controllers: [AppController, SwaggerExportController],
  providers: [
    AppService,
    AuditSubscriber,
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalJwtAuthGuard,
    // },
  ],
})
export class AppModule {}

