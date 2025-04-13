import {
  IsString,
  IsOptional,
  IsDateString,
  IsEmail,
  IsInt,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { AbstractAuthDTO } from './helper.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IRole } from 'src/authentication/types/role.types';

// send authentication details as a response

class AuthMetadataDTO {
  @ApiProperty({ description: 'Account creation date' })
  @IsDateString()
  createdAt: Date;

  // @ApiProperty({ description: 'Last update date' })
  // @IsDateString()
  // updatedAt: Date;

  // @ApiProperty({ required: false, description: 'Last login date' })
  // @IsDateString()
  // @IsOptional()
  // lastLogin?: Date;
}

class AuthTokensDTO {
  @ApiProperty({ description: 'JWT access token' })
  @IsString()
  accessToken: string;

  @ApiProperty({ required: false, description: 'Refresh token' })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  // @ApiProperty({ required: false, description: 'Firebase custom token' })
  // @IsString()
  // @IsOptional()
  // firebaseToken?: string;
}

export class AuthResponseDTO extends AbstractAuthDTO {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  uid: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  emailAddress: string; // Always included in the response.

  @ApiProperty({ description: 'User role' })
  @ValidateNested()
  role: IRole;

  @ApiProperty({ description: 'User provider' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'User tokens' })
  @IsObject()
  tokens: {
    accessToken: string;
    refreshToken: string;
  };

  @ApiProperty({ type: AuthMetadataDTO })
  metadata: AuthMetadataDTO;

  @ApiProperty({
    description: 'Authentication type',
    enum: ['local', 'oauth'],
  })
  @IsString()
  authType: string;

  @IsOptional()
  @IsDateString()
  lastLoginDate?: string;

  @IsOptional()
  @IsInt()
  failedLoginAttempts?: number;
}
