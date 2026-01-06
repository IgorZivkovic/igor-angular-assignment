import { IsIn, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

const genderValues = ['male', 'female', 'other'] as const;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthday!: string;

  @IsIn(genderValues)
  gender!: (typeof genderValues)[number];

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  country!: string;
}
