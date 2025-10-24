import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from 'src/modules/auth/auth.service'

interface JwtPayload {
	sub: string
	email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
		})
	}

	async validate(payload: JwtPayload) {
		const isValid = await this.authService.validateToken(payload.sub)

		if (!isValid) {
			throw new UnauthorizedException('Sessão inválida ou expirada')
		}

		return {
			userId: payload.sub,
			email: payload.email,
		}
	}
}
