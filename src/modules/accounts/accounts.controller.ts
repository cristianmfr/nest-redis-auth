import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/providers/jwt/jwt.guard'
import { AccountsService } from './accounts.service'
import { AccountCreateInput } from './dto/account-create-input.dto'

@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountsService: AccountsService) {}

	@Post()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async createAccount(@Body() createAccountDto: AccountCreateInput) {
		return await this.accountsService.createAccount(createAccountDto)
	}

	@Get(':id')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getAccountById(@Param('id') id: string) {
		return await this.accountsService.getAccountById(id)
	}

	@Get()
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async getAccounts() {
		return await this.accountsService.getAccounts()
	}
}
