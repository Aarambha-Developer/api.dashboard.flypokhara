import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as bodyParser from 'body-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:3000',
      'http://localhost:3080',
      'http://192.168.1.189:3000',
      'http://127.0.0.1:3000',
      'https://pokharaultralight.com.np',
      'http://pokharaultralight.com.np',
      'https://www.pokharaultralight.com.np',
      'http://pokharaultralight.com.np',
    ],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies to be sent
  };
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors(corsOptions);
  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Fly Pokhara Booking API')
    .setDescription('API documentation for Your Project')
    .setVersion('1.0')
    .addBearerAuth() // Optional, for JWT auth setup
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger module at '/api-docs'
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      exceptionFactory: (errors) => {
        if (!Array.isArray(errors)) {
          return new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            error: 'Bad Request',
          });
        }
        // Create an object to hold the formatted errors
        // Create an object to hold the formatted errors
        const formattedErrors = errors.reduce((acc, error) => {
          // Check if the error has children
          if (error.children && error.children.length > 0) {
            // Initialize the property in the accumulator
            acc[error.property] = acc[error.property] || {};

            // Populate the errors for each child
            error.children.forEach((childError) => {
              acc[error.property][childError.property] = Object.values(
                childError.constraints,
              );
            });
          } else {
            // If no children, just push the constraints to the property directly
            acc[error.property] = Object.values(error.constraints);
          }
          return acc;
        }, {}); // Start with an empty object

        return new BadRequestException({
          statusCode: 400,
          status: 'failure',
          message: 'Bad request', // Return the formatted errors as an object
          error: formattedErrors,
        });
      },
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
