import { Category } from './category.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field(() => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    nullable: true,
  })
  owner: User;
}
