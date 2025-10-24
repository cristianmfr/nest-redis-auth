import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { PrismaService } from 'src/providers/prisma/prisma.service'
import { RedisService } from 'src/providers/redis/redis.service'
import { LoginInput } from './dto/login-input.dto'
import { LoginResponse } from './dto/login-response.dto'

interface JwtPayload {
	sub: string
	email: string
	account: string
}

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private redisService: RedisService,
		private prisma: PrismaService,
	) {}

	async login({ email, password }: LoginInput): Promise<LoginResponse> {
		const account = await this.prisma.account.findUnique({
			where: { email },
			include: {
				user: true,
			},
		})

		if (!account) {
			throw new NotFoundException('Invalid email or user account not exists!')
		}

		const matchPasswords = compare(password, account.password)

		if (!matchPasswords) {
			throw new UnauthorizedException('Invalid password!')
		}

		const payload: JwtPayload = {
			sub: account.user.id,
			account: account.id,
			email: account.email,
		}

		const accessToken = this.jwtService.sign(payload)
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

		await this.redisService.set(
			`refresh_token:${account.user.id}`,
			refreshToken,
			7 * 24 * 60 * 60,
		)

		await this.redisService.set(
			`session:${account.user.id}`,
			JSON.stringify({ email: account.user.email, lastLogin: new Date() }),
			60 * 60,
		)

		return {
			accessToken,
			refreshToken,
		}
	}

	async logout(userId: string): Promise<void> {
		await this.redisService.del(`refresh_token:${userId}`)
		await this.redisService.del(`session:${userId}`)
	}

	async refreshAccessToken(refreshToken: string): Promise<string> {
		try {
			const payload = this.jwtService.verify(refreshToken)

			const storedToken = await this.redisService.get(
				`refresh_token:${payload.sub}`,
			)

			if (!storedToken || storedToken !== refreshToken) {
				throw new UnauthorizedException('Invalid refresh token')
			}

			const newPayload: JwtPayload = {
				sub: payload.sub,
				account: payload.account,
				email: payload.email,
			}
			return this.jwtService.sign(newPayload)
		} catch (error) {
			console.log(error)
			throw new UnauthorizedException('Refresh Invalid or Expired Token')
		}
	}

	async validateToken(userId: string): Promise<boolean> {
		return await this.redisService.exists(`session:${userId}`)
	}

	async invalidateAllSessions(userId: string): Promise<void> {
		await this.redisService.del(`refresh_token:${userId}`)
		await this.redisService.del(`session:${userId}`)
	}
}
