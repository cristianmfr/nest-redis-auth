import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from 'src/providers/jwt/jwt.strategy '
import { RedisModule } from 'src/providers/redis/redis.module'
import { AccountsModule } from '../accounts/accounts.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: {
				expiresIn: '1h',
			},
		}),
		RedisModule,
		AccountsModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
