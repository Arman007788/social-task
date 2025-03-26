import { SetMetadata } from '@nestjs/common';

// create publick decorator for open common endpoints
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
