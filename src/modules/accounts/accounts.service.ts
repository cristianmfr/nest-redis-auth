import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from 'src/providers/prisma/prisma.service'
import { AccountCreateInput } from './dto/account-create-input.dto'

@Injectable()
export class AccountsService {
	constructor(private readonly prisma: PrismaService) {}

	async createAccount(data: AccountCreateInput) {
		const { name, email, password, image, activated } = data

		return await this.prisma.account.create({
			data: {
				password: await hash(password, 12),
				activated,
				user: {
					create: {
						name,
						email,
						image,
					},
				},
			},
			include: {
				user: true,
			},
		})
	}

	async getAccountById(accountId: string) {
		return await this.prisma.account.findUnique({
			where: { id: accountId },
			include: {
				user: true,
			},
		})
	}

	async getAccountByUserEmail(userEmail: string) {
		return await this.prisma.account.findUnique({
			where: { email: userEmail },
			include: {
				user: true,
			},
		})
	}

	async getAccounts() {
		return await this.prisma.account.findMany({
			include: {
				user: true,
			},
		})
	}
}
