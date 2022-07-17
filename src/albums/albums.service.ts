import { Injectable } from '@nestjs/common';
import { ALBUMS_DB } from 'src/myDb/myDb';
import { DbEnum } from 'src/untils/dbEnum';
import { v4 as uuid } from 'uuid';
import { AlbumDto } from './dto/album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumsService {
  findAll(): AlbumDto[] {
    return ALBUMS_DB;
  }

  async findOne(albumId: string): Promise<AlbumDto | DbEnum.notFound> {
    const album = ALBUMS_DB.find((album) => album.id === albumId);
    if (!album) return DbEnum.notFound;

    return album;
  }

  async create(albumForCreate: CreateAlbumDto): Promise<AlbumDto> {
    const createdAlbum: AlbumDto = {
      id: this._createId(),
      ...albumForCreate,
    };

    ALBUMS_DB.push(createdAlbum);

    return createdAlbum;
  }

  async updateAlbum(
    albumId: string,
    newAlbumData: CreateAlbumDto,
  ): Promise<AlbumDto | DbEnum> {
    const albumForUpdate = ALBUMS_DB.find((album) => album.id === albumId);

    if (!albumForUpdate) {
      return DbEnum.notFound;
    }

    albumForUpdate.artistId = newAlbumData.artistId;
    albumForUpdate.name = newAlbumData.name;
    albumForUpdate.year = newAlbumData.year;

    return albumForUpdate;
  }

  async delete(albumId: string): Promise<string | DbEnum> {
    const album = ALBUMS_DB.find((album) => album.id === albumId);

    if (!album) {
      return DbEnum.notFound;
    }

    const deleteAlbumIndex = ALBUMS_DB.indexOf(album);
    ALBUMS_DB.splice(deleteAlbumIndex);

    return 'Album was deleted!';
  }

  _createId(): string {
    return uuid();
  }
}
