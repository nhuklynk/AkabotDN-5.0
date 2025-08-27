import { PartialType } from '@nestjs/swagger';
import { CreatePartnerFormDataDto } from './create-partner-formdata.dto';

export class UpdatePartnerFormDataDto extends PartialType(CreatePartnerFormDataDto) {}
