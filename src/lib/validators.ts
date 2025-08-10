import { z } from "zod";

export const GeneratePrayerSchema = z.object({
  situation: z.string().min(3, "Please describe your situation."),
  religion: z.string().min(2),
  name: z.string().optional().nullable(),
  location: z.string().optional().nullable()
});
export type GeneratePrayerInput = z.infer<typeof GeneratePrayerSchema>;

export const SavePrayerSchema = z.object({
  name: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  religion: z.string().min(2),
  situation: z.string().min(3),
  text: z.string().min(3)
});
export type SavePrayerInput = z.infer<typeof SavePrayerSchema>;

export const ListPrayersSchema = z.object({
  cursor: z.string().cuid().optional(),
  take: z.number().int().min(1).max(100).optional()
});
export type ListPrayersInput = z.infer<typeof ListPrayersSchema>;
