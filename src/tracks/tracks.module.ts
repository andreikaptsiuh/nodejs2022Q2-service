import { Module } from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  providers: [TracksService, FavoritesService],
  controllers: [TracksController],
})
export class TracksModule {}
