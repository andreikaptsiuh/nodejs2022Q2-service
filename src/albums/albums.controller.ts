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
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/album.dto';
import { DbEnum } from 'src/untils/dbEnum';
import { CreateAlbumDto } from './dto/create-album.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { FavoritesService } from 'src/favorites/favorites.service';

@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  findAll(): AlbumDto[] {
    return this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string | AlbumDto> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const result = await this.albumsService.findOne(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Album with id: ${id} not found`;
    }

    return result as AlbumDto;
  }

  @Post()
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createAlbum: CreateAlbumDto,
  ): Promise<string | AlbumDto> {
    if (
      createAlbum.artistId === undefined ||
      typeof createAlbum.name !== 'string' ||
      typeof createAlbum.year !== 'number'
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Name, year and artistId fields is required!';
    }

    return await this.albumsService.create(createAlbum);
  }

  @Put(':id')
  async update(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Body() newAlbumData: CreateAlbumDto,
  ): Promise<string | AlbumDto> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    if (
      newAlbumData.artistId === undefined ||
      typeof newAlbumData.name !== 'string' ||
      typeof newAlbumData.year !== 'number'
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Name, year and artistId fields is required!';
    }

    const result = await this.albumsService.updateAlbum(id, newAlbumData);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Album with id: ${id} not found`;
    }

    return result as AlbumDto;
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

    const result = await this.albumsService.delete(id);

    if (result === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Album with id: ${id} not found`;
    }

    const deleteFromFavorites = await this.favoritesService.deleteFavoriteAlbum(
      id,
    );
    if (deleteFromFavorites !== DbEnum.notFound) {
      console.log(deleteFromFavorites);
    }

    const allTracks = await this.tracksService.findAll();
    const albumTracks = allTracks.filter((track) => track.albumId === id);

    albumTracks?.forEach((track) => {
      const updatedTrack: CreateTrackDto = {
        ...track,
        albumId: null,
      };

      this.tracksService.updateTrack(track.id, updatedTrack);
    });

    res.status(HttpStatus.NO_CONTENT);
    return result as string;
  }
}
