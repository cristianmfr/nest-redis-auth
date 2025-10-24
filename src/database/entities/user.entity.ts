import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class User {
	@IsUUID()
	@IsNotEmpty()
	id: string

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	email: string

	@IsString()
	image?: string

	@IsDate()
	@IsNotEmpty()
	createdAt: Date

	@IsDate()
	@IsNotEmpty()
	updatedDate: Date
}
