import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { env } from './config/env.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors()

	const config = new DocumentBuilder()
		.setTitle('NestJS Redis Auth API')
		.setDescription('API de autenticação com NestJS, Redis e JWT')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth',
		)
		.addTag('auth', 'Endpoints de autenticação')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('docs', app, documentFactory)

	await app.listen(env.PORT ?? 3333)
}
bootstrap()
