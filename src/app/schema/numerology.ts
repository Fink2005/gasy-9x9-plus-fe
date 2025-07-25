import z from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  birthDate: z.date().refine(value => value !== null, {
    message: 'Vui lòng chọn ngày sinh',
  }),
  gender: z.enum(['Nam', 'Nữ', 'Khác']).refine(value => !!value, {
    message: 'Vui lòng chọn giới tính',
  }),
});
export type ProfileFormData = z.infer<typeof profileSchema>;
