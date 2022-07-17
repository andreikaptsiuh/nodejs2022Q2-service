import { AlbumDto } from 'src/albums/dto/album.dto';
import { ArtistDto } from 'src/artists/dto/artist.dto';
import { TrackDto } from 'src/tracks/dto/track.dto';

export interface FavoritesRepsonse {
  artists: ArtistDto[];
  albums: AlbumDto[];
  tracks: TrackDto[];
}
