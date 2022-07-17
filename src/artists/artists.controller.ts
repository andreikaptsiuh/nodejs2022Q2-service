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
import { Response } from 'express';
import { FavoritesService } from 'src/favorites/favorites.service';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { DbEnum } from 'src/untils/dbEnum';
import { validate } from 'uuid';
import { ArtistsService } from './artists.service';
import { ArtistDto } from './dto/artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  async findAll(): Promise<ArtistDto[]> {
    return await this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<ArtistDto | string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = await this.artistsService.findOne(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    return result as ArtistDto;
  }

  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createArtist: CreateArtistDto,
  ): Promise<string | ArtistDto> {
    if (createArtist.grammy === undefined || createArtist.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Name and grammy fields is required!';
    }

    return await this.artistsService.create(createArtist);
  }

  @Put(':id')
  async update(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Body() newArtistData: UpdateArtistDto,
  ): Promise<string | ArtistDto> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    if (
      newArtistData.grammy === undefined ||
      typeof newArtistData.name !== 'string'
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Artist`s name and grammy fields is required!';
    }

    const result = await this.artistsService.updateArtist(id, newArtistData);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    return result as ArtistDto;
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

    const result = await this.artistsService.delete(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    const deleteFromFavorites =
      await this.favoritesService.deleteFavoriteArtist(id);
    if (deleteFromFavorites !== DbEnum.notFound) {
      console.log(deleteFromFavorites);
    }

    const allTracks = await this.tracksService.findAll();
    const artistTracks = allTracks.filter((track) => track.artistId === id);

    artistTracks?.forEach((track) => {
      const updatedTrack: CreateTrackDto = {
        ...track,
        artistId: null,
        albumId: null,
      };

      this.tracksService.updateTrack(track.id, updatedTrack);
    });

    res.status(HttpStatus.NO_CONTENT);
    return result as string;
  }
}
