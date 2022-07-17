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
  findAll(): ArtistDto[] {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): ArtistDto | string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = this.artistsService.findOne(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    return result as ArtistDto;
  }

  @Post()
  create(
    @Res({ passthrough: true }) res: Response,
    @Body() createArtist: CreateArtistDto,
  ): ArtistDto | string {
    if (createArtist.grammy === undefined || createArtist.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Name and grammy fields is required!';
    }

    return this.artistsService.create(createArtist);
  }

  @Put(':id')
  update(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Body() newArtistData: UpdateArtistDto,
  ): ArtistDto | string {
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

    const result = this.artistsService.updateArtist(id, newArtistData);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    return result as ArtistDto;
  }

  @Delete(':id')
  delete(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = this.artistsService.delete(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    const deleteFromFavorites = this.favoritesService.deleteFavoriteArtist(id);
    if (deleteFromFavorites !== DbEnum.notFound) {
      console.log(deleteFromFavorites);
    }

    const allTracks = this.tracksService.findAll();
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
