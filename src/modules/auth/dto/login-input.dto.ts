import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginInput {
	@ApiProperty({
		description: 'Email do usuário',
		example: 'usuario@example.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		description: 'Senha do usuário',
		example: 'senha123',
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	password: string
}
