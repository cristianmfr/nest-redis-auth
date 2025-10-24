import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'
import { env } from 'src/config/env.config'

@Injectable()
export class RedisService implements OnModuleDestroy {
	private client: RedisClientType

	constructor() {
		this.client = createClient({
			url: env.REDIS_URL || 'redis://localhost:6379',
		})

		this.client.on('error', (err) => console.error('Redis Client Error', err))
		this.client.connect()
	}

	async get(key: string): Promise<string | null> {
		return await this.client.get(key)
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		if (ttl) {
			await this.client.setEx(key, ttl, value)
		} else {
			await this.client.set(key, value)
		}
	}

	async del(key: string): Promise<void> {
		await this.client.del(key)
	}

	async exists(key: string): Promise<boolean> {
		const result = await this.client.exists(key)
		return result === 1
	}

	async onModuleDestroy() {
		await this.client.quit()
	}
}
