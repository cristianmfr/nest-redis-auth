import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator'

export class AccountCreateInput {
	@IsString()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsOptional()
	image?: string

	@IsString()
	@MinLength(6)
	password: string

	@IsBoolean()
	activated: boolean
}
