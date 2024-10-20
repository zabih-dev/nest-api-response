# API Response Wrapper Library for NestJS

<p align="center">
<a href="https://www.npmjs.org/package/@zabih-dev/nest-api-response" target="_blank"><img src="https://img.shields.io/npm/v/@zabih-dev/nest-api-response.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

This NestJS library provides a standardized API response wrapper that ensures consistent response structures across your application. It includes an interceptor to automatically wrap responses in a DTO format, and also allows flexibility by skipping this behavior using a decorator.

## Features

- **Automatic Response Wrapping**: Standardizes the API response format with success, status code, message, and error handling.
- **Customizable Responses**: Allows returning raw responses by using the `@RawResponse()` decorator to skipping the wrapped response.
- **Validation Error Handling**: Includes a `class validator` to return errors based on the validation.

## Installation

Install the package using npm:

```bash
npm install @zabih-dev/nest-api-response
```

## Usage

Open the `app.module.ts` file and add `ApiResponseModule` to the `imports` array.

```typescript
import { ApiResponseModule } from '@zabih-dev/nest-api-response';
@Module({
  imports: [ApiResponseModule], // Add this line
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Now all routes will return a wrapped response

By default, all API responses will automatically be wrapped in the following format:

```typescript
export class ApiResponseDto<TData> {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: ValidationErrorDto[];
  data: TData | TData[];
}
```

And the `ValidationErrorDto` is used for handling class validation errors.

```typescript
export class ValidationErrorDto {
  field: string;
  messages: string[];
}
```

## Example of Wrapped Response

For a successful response:

```typescript
@Controller()
export class AppController {
  // will be wrapped by the api response
  @Get('users')
  getUsers() {
    return [
      { id: 1, name: 'John' },
      { id: 2, name: 'Petter' },
    ];
  }
}
```

Wrapped Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": null,
  "data": [
    {
      "id": 1,
      "name": "John"
    },
    {
      "id": 2,
      "name": "Petter"
    }
  ]
}
```

### Skipping the Response Wrapper

To return a raw response without wrapping it in `ApiResponseDto`, simply use the `@RawResponse()` decorator on the handler:

```typescript
import { RawResponse } from '@zabih-dev/nest-api-response';

@Controller()
export class AppController {
  @RawResponse() // add it to skip the response wrapper
  @Get('users')
  getUsers() {
    return [
      { id: 1, name: 'John' },
      { id: 2, name: 'Petter' },
    ];
  }
}
```

Response without the wrapping:

```json
[
  {
    "id": 1,
    "name": "John"
  },
  {
    "id": 2,
    "name": "Petter"
  }
]
```

### For a validation error response:

Consider we have a `/signin` route

```typescript
// controller.ts
signin(@Body() dto: AuthDto) {
  return dto;
}

// dto.ts file
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

In the case of a `validation failure`, the response will be like this:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "messages": ["email should not be empty", "email must be an email"]
    },
    {
      "field": "password",
      "messages": ["password should not be empty", "password must be a string"]
    }
  ],
  "data": null
}
```

## Contributing

Feel free to contribute by submitting a pull request or opening an issue if you find any bugs.

## License

[MIT License](LICENSE)
