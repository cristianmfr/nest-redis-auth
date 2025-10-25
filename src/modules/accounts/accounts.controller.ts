import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/providers/jwt/jwt.guard'
import { AccountsService } from './accounts.service'
import { AccountCreateInput } from './dto/account-create-input.dto'

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Criar uma nova conta' })
	@ApiResponse({ status: 200, description: 'Conta criada com sucesso' })
	@ApiResponse({ status: 400, description: 'Dados inválidos' })
	@ApiResponse({ status: 401, description: 'Não autorizado' })
	@ApiResponse({ status: 409, description: 'Email já cadastrado' })
	async createAccount(@Body() createAccountDto: AccountCreateInput) {
		return await this.accountsService.createAccount(createAccountDto)
	}

	@Get(':id')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Obter conta por ID' })
	@ApiResponse({ status: 200, description: 'Conta encontrada' })
	@ApiResponse({ status: 401, description: 'Não autorizado' })
	@ApiResponse({ status: 404, description: 'Conta não encontrada' })
	async getAccountById(@Param('id') id: string) {
		return await this.accountsService.getAccountById(id)
	}

	@Get()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Listar todas as contas' })
	@ApiResponse({ status: 200, description: 'Lista de contas retornada com sucesso' })
	@ApiResponse({ status: 401, description: 'Não autorizado' })
	async getAccounts() {
		return await this.accountsService.getAccounts()
	}
}
