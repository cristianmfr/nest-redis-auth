import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AccountsModule } from './modules/accounts/accounts.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './providers/prisma/prisma.module'
import { RedisModule } from './providers/redis/redis.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		RedisModule,
		AuthModule,
		AccountsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
