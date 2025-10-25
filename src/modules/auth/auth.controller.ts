import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/providers/jwt/jwt.guard'
import { AccountsService } from '../accounts/accounts.service'
import { AuthService } from './auth.service'
import { LoginInput } from './dto/login-input.dto'
import { LoginResponse } from './dto/login-response.dto'
import { RefreshTokenInput } from './dto/refresh-token-input.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private accountService: AccountsService,
	) {}

	@Post('login')
	@HttpCode(200)
	@ApiOperation({ summary: 'Realizar login' })
	@ApiResponse({
		status: 200,
		description: 'Login realizado com sucesso',
		type: LoginResponse,
	})
	@ApiResponse({ status: 401, description: 'Credenciais inválidas' })
	async login(@Body() loginInputDto: LoginInput) {
		return await this.authService.login(loginInputDto)
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Realizar logout' })
	@ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
	@ApiResponse({ status: 401, description: 'Não autorizado' })
	async logout(@Request() req) {
		await this.authService.logout(req.user.userId)
		return { message: 'Logout realizado com sucesso' }
	}

	@Post('refresh')
	@HttpCode(200)
	@ApiOperation({ summary: 'Atualizar token de acesso' })
	@ApiResponse({
		status: 200,
		description: 'Token atualizado com sucesso',
		schema: {
			properties: {
				accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
			},
		},
	})
	@ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
	async refresh(@Body() refreshTokenInputDto: RefreshTokenInput) {
		const accessToken = await this.authService.refreshAccessToken(
			refreshTokenInputDto.refreshToken,
		)
		return { accessToken }
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
	@ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
	@ApiResponse({ status: 401, description: 'Não autorizado' })
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
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Invalidar todas as sessões do usuário' })
	@ApiResponse({ status: 200, description: 'Sessões invalidadas com sucesso' })
	@ApiResponse({ status: 401, description: 'Não autorizado' })
	async invalidateAllSessions(@Request() req) {
		await this.authService.invalidateAllSessions(req.user.userId)
		return { message: 'Todas as sessões foram invalidadas' }
	}
}
