import { AlbumDto } from 'src/albums/dto/album.dto';
import { ArtistDto } from 'src/artists/dto/artist.dto';
import { FavoritesDto } from 'src/favorites/dto/favorites.dto';
import { TrackDto } from 'src/tracks/dto/track.dto';
import { UserDto } from 'src/users/dto/user.dto';

export const ALBUMS_DB: AlbumDto[] = [
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e288c',
    name: 'mega alb',
    year: 1988,
    artistId: '6b6e261f-3dbe-45ae-9ac4-6f6da02e287b',
  },
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e288d',
    name: 'world',
    year: 2001,
    artistId: '6b6e261f-3dbe-45ae-9ac4-6f6da02e287b',
  },
];

export const ARTISTS_DB: ArtistDto[] = [
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e287b',
    name: 'Linkin park',
    grammy: true,
  },
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e288b',
    name: 'Ocean',
    grammy: false,
  },
];

export const FAVORITES_DB: FavoritesDto = {
  artists: ['6b6e261f-3dbe-45ae-9ac4-6f6da02e288b'],
  albums: ['6b6e261f-3dbe-45ae-9ac4-6f6da02e288c'],
  tracks: ['6b6e261f-3dbe-45ae-9ac4-6f6da02e289d'],
};

export const TRACKS_DB: TrackDto[] = [
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e289a',
    name: 'new track',
    artistId: null,
    albumId: null,
    duration: 5,
  },
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e289d',
    name: 'mega track',
    artistId: null,
    albumId: null,
    duration: 4,
  },
];

export const USERS_DB: UserDto[] = [
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e289c',
    login: 'Tonni',
    password: 'secret',
    version: 1,
    createdAt: 1657700046,
    updatedAt: 1657700046,
  },
  {
    id: '6b6e261f-3dbe-45ae-9ac4-6f6da02e289b',
    login: 'Artur',
    password: 'world',
    version: 1,
    createdAt: 1657700046,
    updatedAt: 1657700046,
  },
];
