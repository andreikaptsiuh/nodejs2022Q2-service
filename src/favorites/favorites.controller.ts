import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { AlbumsService } from 'src/albums/albums.service';
import { AlbumDto } from 'src/albums/dto/album.dto';
import { ArtistsService } from 'src/artists/artists.service';
import { ArtistDto } from 'src/artists/dto/artist.dto';
import { TrackDto } from 'src/tracks/dto/track.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { DbEnum } from 'src/untils/dbEnum';
import { FavoritesRepsonse } from './dto/favorites-response.dto';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  @Get()
  async findAll(): Promise<FavoritesRepsonse> {
    const favorites = await this.favoritesService.findAllFavorites();

    const artists: ArtistDto[] = [];

    favorites.artists.forEach(async (id) => {
      const artist = await this.artistsService.findOne(id);
      if (artist !== DbEnum.notFound) {
        artists.push(artist);
      }
    });

    const albums: AlbumDto[] = [];
    favorites.albums.forEach(async (id) => {
      const album = await this.albumsService.findOne(id);
      if (album !== DbEnum.notFound) {
        albums.push(album);
      }
    });

    const tracks: TrackDto[] = [];
    favorites.tracks.forEach(async (id) => {
      const track = await this.tracksService.findOne(id);
      if (track !== DbEnum.notFound) {
        tracks.push(track);
      }
    });

    const response: FavoritesRepsonse = {
      artists,
      albums,
      tracks,
    };

    return response;
  }

  // Tracks
  @Post('track/:id')
  async addTrack(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const track = await this.tracksService.findOne(id);
    if (track === DbEnum.notFound) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return 'Track with this id not found!';
    }

    const response = await this.favoritesService.addFavoriteTrack(id);
    return response;
  }

  @Delete('track/:id')
  async deleteTrack(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const response = await this.favoritesService.deleteFavoriteTrack(id);

    if (response === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Track with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return response;
  }

  // Albums
  @Post('album/:id')
  async addAlbum(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const album = await this.albumsService.findOne(id);
    if (album === DbEnum.notFound) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return 'Album with this id not found!';
    }

    const response = await this.favoritesService.addFavoriteAlbum(id);
    return response;
  }

  @Delete('album/:id')
  async deleteAlbum(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const response = await this.favoritesService.deleteFavoriteAlbum(id);

    if (response === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Album with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return response;
  }

  // Artists
  @Post('artist/:id')
  async addArtist(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const artist = await this.artistsService.findOne(id);
    if (artist === DbEnum.notFound) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return 'Artist with this id not found!';
    }

    const response = await this.favoritesService.addFavoriteArtist(id);
    return response;
  }

  @Delete('artist/:id')
  async deleteArtist(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): Promise<string> {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const response = await this.favoritesService.deleteFavoriteArtist(id);

    if (response === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return response;
  }
}
