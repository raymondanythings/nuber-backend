import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query(() => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((returns) => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async updateRestaurant(
    @Args() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    if (Object.keys(updateRestaurantDto.data).length === 0) {
      return false;
    }
    try {
      await this.restaurantService.UpdateRestaurant(updateRestaurantDto);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
