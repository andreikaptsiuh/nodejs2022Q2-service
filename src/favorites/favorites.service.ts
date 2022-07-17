import { Injectable } from '@nestjs/common';
import { FAVORITES_DB } from 'src/myDb/myDb';
import { DbEnum } from 'src/untils/dbEnum';
import { FavoritesDto } from './dto/favorites.dto';

@Injectable()
export class FavoritesService {
  async findAllFavorites(): Promise<FavoritesDto> {
    return FAVORITES_DB;
  }

  // Artists
  async addFavoriteArtist(artistId: string): Promise<string> {
    FAVORITES_DB.artists.push(artistId);
    return 'Artist added to favorites!';
  }

  async deleteFavoriteArtist(
    artistId: string,
  ): Promise<string | DbEnum.notFound> {
    const artist = FAVORITES_DB.artists.find((id) => id === artistId);

    if (!artist) {
      return DbEnum.notFound;
    }

    const deleteartistIndex = FAVORITES_DB.artists.indexOf(artist);
    FAVORITES_DB.artists.splice(deleteartistIndex);

    return 'Artist deleted from favorites!';
  }

  // Albums
  async addFavoriteAlbum(albumtId: string): Promise<string> {
    FAVORITES_DB.albums.push(albumtId);
    return 'Album added to favorites!';
  }

  async deleteFavoriteAlbum(
    albumtId: string,
  ): Promise<string | DbEnum.notFound> {
    const album = FAVORITES_DB.albums.find((id) => id === albumtId);

    if (!album) {
      return DbEnum.notFound;
    }

    const deleteartistIndex = FAVORITES_DB.albums.indexOf(album);
    FAVORITES_DB.albums.splice(deleteartistIndex);

    return 'Album deleted from favorites!';
  }

  // Tracks
  async addFavoriteTrack(trackId: string): Promise<string> {
    FAVORITES_DB.tracks.push(trackId);
    return 'Track added to favorites!';
  }

  async deleteFavoriteTrack(
    trackId: string,
  ): Promise<string | DbEnum.notFound> {
    const track = FAVORITES_DB.tracks.find((id) => id === trackId);

    if (!track) {
      return DbEnum.notFound;
    }

    const deleteartistIndex = FAVORITES_DB.tracks.indexOf(track);
    FAVORITES_DB.tracks.splice(deleteartistIndex);

    return 'Track deleted from favorites!';
  }
}
