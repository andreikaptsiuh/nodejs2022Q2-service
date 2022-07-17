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
  findAll(): FavoritesRepsonse {
    const favorites = this.favoritesService.findAllFavorites();

    const artists: ArtistDto[] = favorites.artists.map((id) => {
      const artist = this.artistsService.findOne(id);
      if (artist !== DbEnum.notFound) {
        return artist;
      }
    });

    const albums: AlbumDto[] = favorites.albums.map((id) => {
      const album = this.albumsService.findOne(id);
      if (album !== DbEnum.notFound) {
        return album;
      }
    });

    const tracks: TrackDto[] = favorites.tracks.map((id) => {
      const track = this.tracksService.findOne(id);
      if (track !== DbEnum.notFound) {
        return track;
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
  addTrack(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const track = this.tracksService.findOne(id);
    if (track === DbEnum.notFound) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return 'Track with this id not found!';
    }

    const response = this.favoritesService.addFavoriteTrack(id);
    return response;
  }

  @Delete('track/:id')
  deleteTrack(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const response = this.favoritesService.deleteFavoriteTrack(id);

    if (response === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Track with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return response;
  }

  // Albums
  @Post('album/:id')
  addAlbum(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const album = this.albumsService.findOne(id);
    if (album === DbEnum.notFound) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return 'Album with this id not found!';
    }

    const response = this.favoritesService.addFavoriteAlbum(id);
    return response;
  }

  @Delete('album/:id')
  deleteAlbum(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const response = this.favoritesService.deleteFavoriteAlbum(id);

    if (response === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Album with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return response;
  }

  // Artists
  @Post('artist/:id')
  addArtist(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const artist = this.artistsService.findOne(id);
    if (artist === DbEnum.notFound) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return 'Artist with this id not found!';
    }

    const response = this.favoritesService.addFavoriteArtist(id);
    return response;
  }

  @Delete('artist/:id')
  deleteArtist(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ): string {
    if (!validate(id)) {
      res.status(HttpStatus.BAD_REQUEST);
      return 'Id not valid';
    }

    const response = this.favoritesService.deleteFavoriteArtist(id);

    if (response === DbEnum.notFound) {
      res.status(HttpStatus.NOT_FOUND);
      return `Artist with id: ${id} not found`;
    }

    res.status(HttpStatus.NO_CONTENT);
    return response;
  }
}
