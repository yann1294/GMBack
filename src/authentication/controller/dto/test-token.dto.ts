import { IsString, IsOptional, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestTokenRequestDTO {
  @ApiProperty({ description: 'User ID to generate token for' })
  @IsString()
  uid!: string;

  @ApiProperty({
    description: 'Optional developer claims',
    example: { role: 'admin' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  claims?: Record<string, any>;

  @ApiProperty({ description: 'Optional email to generate token for' })
  @IsOptional()
  @IsNotEmpty()
  email?: string;
}

export class TestTokenResponseDTO {
  @ApiProperty({ description: 'Generated custom token' })
  token!: string;
}
