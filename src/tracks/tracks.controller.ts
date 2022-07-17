import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { TrackDto } from './dto/track.dto';
import { TracksService } from './tracks.service';
import { DbEnum } from 'src/untils/dbEnum';
import { CreateTrackDto } from './dto/create-track.dto';
import { FavoritesService } from 'src/favorites/favorites.service';

@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  async findAll(): Promise<TrackDto[]> {
    return await this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string | TrackDto> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = await this.tracksService.findOne(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Track with id: ${id} not found`;
    }

    return result as TrackDto;
  }

  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createTrack: CreateTrackDto,
  ): Promise<string | TrackDto> {
    if (
      createTrack.albumId === undefined ||
      createTrack.artistId === undefined ||
      typeof createTrack.duration !== 'number' ||
      typeof createTrack.name !== 'string'
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Name, duration, artistId and albumId fields is required!';
    }

    return await this.tracksService.create(createTrack);
  }

  @Put(':id')
  async update(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Body() newTracktData: CreateTrackDto,
  ): Promise<string | TrackDto> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    if (
      newTracktData.albumId === undefined ||
      newTracktData.artistId === undefined ||
      typeof newTracktData.duration !== 'number' ||
      typeof newTracktData.name !== 'string'
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Name, duration, artistId and albumId fields is required!';
    }

    const result = await this.tracksService.updateTrack(id, newTracktData);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Track with id: ${id} not found`;
    }

    return result as TrackDto;
  }

  @Delete(':id')
  async delete(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = await this.tracksService.delete(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Track with id: ${id} not found`;
    }

    const deleteFromFavorites = await this.favoritesService.deleteFavoriteTrack(
      id,
    );
    if (deleteFromFavorites !== DbEnum.notFound) {
      console.log(deleteFromFavorites);
    }

    res.status(HttpStatus.NO_CONTENT);
    return result as string;
  }
}
