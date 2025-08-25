import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Member } from './entity/member.entity';
import { Company } from './entity/company.entity';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Company])],
  controllers: [MemberController, CompanyController],
  providers: [MemberService, CompanyService],
  exports: [MemberService, CompanyService],
})
export class MemberModule {}
