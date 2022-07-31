import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;
  @Field(() => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  address: string;

  @Field(() => Boolean, { defaultValue: true })
  @Column()
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;
}
