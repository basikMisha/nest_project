/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Req,
  Post,
  UseGuards,
  Delete,
  Query,
  Get
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchListDTO } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { CreateAssetResponce, GetUserAssetsResponce } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatchList } from './models/watchlist.model';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiTags('API')
  @ApiResponse({
    status: 201,
    type: CreateAssetResponce,
  })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createAsset(@Body() assetDto: WatchListDTO, @Req() request): Promise<CreateAssetResponce> {
    const user = request.user;
    return this.watchlistService.createAsset(user, assetDto);
  }

  @ApiTags('API')
  @ApiResponse({status: 200, type: GetUserAssetsResponce})
  @UseGuards(JwtAuthGuard)
  @Get('get-elements')
  getUserAssets(@Req() request): Promise<WatchList[]> {
    const user = request.user;
    return this.watchlistService.getUserAssets(user.id)
  } 

  @ApiTags('API')
  @ApiResponse({status: 200})
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteAsset(@Query('id') assetId: string, @Req() request): Promise<boolean> {
    try {
      const { id } = request.user;
      return this.watchlistService.deleteAsset(id, assetId);
    } catch (error) {
      throw new Error(error);
    }
  }

}
