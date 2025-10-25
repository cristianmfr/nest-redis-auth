import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenInput {
	@ApiProperty({
		description: 'Token de atualização',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString()
	@IsNotEmpty()
	refreshToken: string
}
