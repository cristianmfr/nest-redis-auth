import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/providers/jwt/jwt.guard'
import { AccountsService } from '../accounts/accounts.service'
import { AuthService } from './auth.service'
import { LoginInput } from './dto/login-input.dto'
import { RefreshTokenInput } from './dto/refresh-token-input.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private accountService: AccountsService,
	) {}

	@Post('login')
	@HttpCode(200)
	async login(@Body() loginInputDto: LoginInput) {
		return await this.authService.login(loginInputDto)
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	async logout(@Request() req) {
		await this.authService.logout(req.user.userId)
		return { message: 'Logout realizado com sucesso' }
	}

	@Post('refresh')
	@HttpCode(200)
	async refresh(@Body() refreshTokenInputDto: RefreshTokenInput) {
		const accessToken = await this.authService.refreshAccessToken(
			refreshTokenInputDto.refreshToken,
		)
		return { accessToken }
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async getProfile(@Request() req) {
		const requestData = {
			userId: req.user.userId,
			email: req.user.email,
		}

		return await this.accountService.getAccountByUserEmail(requestData.email)
	}

	@Post('invalidate-sessions')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	async invalidateAllSessions(@Request() req) {
		await this.authService.invalidateAllSessions(req.user.userId)
		return { message: 'Todas as sessões foram invalidadas' }
	}
}
