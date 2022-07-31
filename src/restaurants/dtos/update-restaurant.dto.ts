import { CreateRestaurantDto } from './create-restaurant.dto';
import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {
  @Field((type) => Boolean, { nullable: true })
  isVegan?: boolean;

  @Field((type) => String, { nullable: true })
  address?: string;
}

@ArgsType()
export class UpdateRestaurantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
