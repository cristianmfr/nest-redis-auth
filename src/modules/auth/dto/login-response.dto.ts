import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginResponse {
	@ApiProperty({
		description: 'Token de acesso JWT',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString()
	accessToken: string

	@ApiProperty({
		description: 'Token de atualização',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString()
	refreshToken: string
}
