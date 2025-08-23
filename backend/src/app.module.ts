import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/database.config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { MediaModule } from './media/media.module';
import { MemberModule } from './member/member.module';
import { FaqModule } from './faq/faq.module';
import { PartnerModule } from './partner/partner.module';
import { AuditSubscriber } from './config/audit.subscriber';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    CommonModule,
    UserModule,
    PostModule,
    CategoryModule,
    TagModule,
    CommentModule,
    MediaModule,
    MemberModule,
    FaqModule,
    PartnerModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuditSubscriber],
})
export class AppModule {}
