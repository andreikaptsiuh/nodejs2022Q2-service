export interface CreateAlbumDto {
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
