import { Injectable } from '@nestjs/common';
import { DbEnum } from 'src/untils/dbEnum';
import { v4 as uuid } from 'uuid';
import { AlbumDto } from './dto/album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';

const ALBUMS_DB: AlbumDto[] = [];

@Injectable()
export class AlbumsService {
  findAll(): AlbumDto[] {
    return ALBUMS_DB;
  }

  findOne(albumId: string): AlbumDto | DbEnum.notFound {
    const album = ALBUMS_DB.find((album) => album.id === albumId);
    if (!album) return DbEnum.notFound;

    return album;
  }

  create(albumForCreate: CreateAlbumDto): AlbumDto {
    const createdAlbum: AlbumDto = {
      id: this._createId(),
      ...albumForCreate,
    };

    ALBUMS_DB.push(createdAlbum);

    return createdAlbum;
  }

  updateAlbum(
    albumId: string,
    newAlbumData: CreateAlbumDto,
  ): AlbumDto | DbEnum {
    const albumForUpdate = ALBUMS_DB.find((album) => album.id === albumId);

    if (!albumForUpdate) {
      return DbEnum.notFound;
    }

    albumForUpdate.artistId = newAlbumData.artistId;
    albumForUpdate.name = newAlbumData.name;
    albumForUpdate.year = newAlbumData.year;

    return albumForUpdate;
  }

  delete(albumId: string): DbEnum | string {
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
