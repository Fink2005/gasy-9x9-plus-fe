import { z } from 'zod';

export const KYCSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  citizenId: z
    .string()
    .min(1, 'Citizen ID is required')
    .regex(/^\d{9,12}$/, 'Citizen ID must be 9-12 digits only')
});

export type KYCFormData = z.infer<typeof KYCSchema>;
