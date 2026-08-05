import { z } from 'zod';

export const searchQuerySchema = z
  .object({
    query: z
      .string()
      .min(1, { message: 'Search location query cannot be empty.' })
      .max(100, { message: 'Search location query cannot exceed 100 characters.' })
      .trim(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate).getTime();
        const end = new Date(data.endDate).getTime();
        return !isNaN(start) && !isNaN(end) && start <= end;
      }
      return true;
    },
    { message: 'Start date must be earlier than or equal to end date.', path: ['startDate'] }
  );

export const coordinateQuerySchema = z.object({
  latitude: z.coerce
    .number()
    .min(-90, { message: 'Latitude must be greater than or equal to -90.' })
    .max(90, { message: 'Latitude must be less than or equal to 90.' }),
  longitude: z.coerce
    .number()
    .min(-180, { message: 'Longitude must be greater than or equal to -180.' })
    .max(180, { message: 'Longitude must be less than or equal to 180.' }),
});

export const historyUpdateSchema = z.object({
  notes: z.string().max(500, { message: 'Notes cannot exceed 500 characters.' }).optional(),
  locationName: z.string().min(1, 'Location name cannot be empty').max(100).optional(),
  temperature: z.coerce
    .number()
    .min(-100, { message: 'Temperature must be at least -100°C.' })
    .max(100, { message: 'Temperature cannot exceed 100°C.' })
    .optional(),
  weatherCondition: z.string().min(1).max(50).optional(),
});

export const savedLocationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  notes: z.string().max(500).optional(),
});

export const exportQuerySchema = z.object({
  format: z.enum(['json', 'csv', 'pdf'], {
    errorMap: () => ({ message: "Export format must be 'json', 'csv', or 'pdf'." }),
  }),
  startDate: z.string().datetime({ message: 'Invalid start date format' }).optional(),
  endDate: z.string().datetime({ message: 'Invalid end date format' }).optional(),
  limit: z.coerce.number().min(1).max(1000).default(100),
});
