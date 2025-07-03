import type { User } from '@sentry/nextjs';

export type LoginPayload = { address: string; signature: string; message: string };

export type LoginResponse = { result: User } | null;
