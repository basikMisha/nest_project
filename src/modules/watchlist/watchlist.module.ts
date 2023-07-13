import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';
import { WatchList } from './models/watchlist.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([WatchList])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
