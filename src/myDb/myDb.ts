import { AlbumDto } from 'src/albums/dto/album.dto';
import { ArtistDto } from 'src/artists/dto/artist.dto';
import { FavoritesDto } from 'src/favorites/dto/favorites.dto';
import { TrackDto } from 'src/tracks/dto/track.dto';
import { UserDto } from 'src/users/dto/user.dto';

export const ALBUMS_DB: AlbumDto[] = [];
export const ARTISTS_DB: ArtistDto[] = [];
export const FAVORITES_DB: FavoritesDto = {
  artists: [],
  albums: [],
  tracks: [],
};
export const TRACKS_DB: TrackDto[] = [];
export const USERS_DB: UserDto[] = [];
