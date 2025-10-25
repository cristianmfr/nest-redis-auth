import { ApiProperty } from '@nestjs/swagger'
import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class AccountCreateInput {
	@ApiProperty({
		description: 'Email do usuário',
		example: 'usuario@example.com',
	})
	@IsString()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		description: 'Nome do usuário',
		example: 'João Silva',
	})
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({
		description: 'URL da imagem do perfil',
		example: 'https://example.com/avatar.jpg',
		required: false,
	})
	@IsString()
	@IsOptional()
	image?: string

	@ApiProperty({
		description: 'Senha do usuário',
		example: 'senha123',
		minLength: 6,
	})
	@IsString()
	@MinLength(6)
	password: string

	@ApiProperty({
		description: 'Status de ativação da conta',
		example: true,
	})
	@IsBoolean()
	activated: boolean
}
