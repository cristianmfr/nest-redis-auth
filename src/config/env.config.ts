import z from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().startsWith('postgresql://'),
	REDIS_URL: z.string().startsWith('redis://'),
	JWT_SECRET_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
