import { SetMetadata } from '@nestjs/common';

export const INTERNAL_ACCESS_KEY = 'internalAccess';
export const InternalAccess = () => SetMetadata(INTERNAL_ACCESS_KEY, true);
