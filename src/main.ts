import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Master`s Guild').build();
  const document = SwaggerModule.createDocument(app, config);
  // роут по которому этот документ будет хоститься
  SwaggerModule.setup(`api`, app, document);
  // http://localhost:3000/api-yaml - наше open api

  // используем куки парсер глобально
  app.use(cookieParser());
  // пайп проверяет информацию в запросе до того как она попадет в контроллер
  // то, как пайп будет валидировать, нужно указать декораторами в dto
  app.useGlobalPipes(new ValidationPipe());

  // app.enableCors();

  await app.listen(3000);
}
bootstrap();
