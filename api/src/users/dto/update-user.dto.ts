import { IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const genderValues = ['male', 'female', 'other'] as const;

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthday?: string;

  @IsOptional()
  @IsIn(genderValues)
  gender?: (typeof genderValues)[number];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  country?: string;
}
