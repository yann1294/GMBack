import { IsArray, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for updating the "tours" field of a package.
 * Used when you just want to attach/replace tour IDs.
 */
export class UpdatePackageToursDTO {
  // Package identifier whose tours are being updated

  @IsString()
  @IsNotEmpty()
  id: string;

  // List of associated tour IDs (all strings)
  @IsArray()
  @IsString({ each: true })
  tours!: string[];
}
