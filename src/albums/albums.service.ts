import { Injectable } from "@nestjs/common";
import { DbEnum } from "src/untils/dbEnum";
import { v4 as uuid } from 'uuid';
import { AlbumDto } from "./dto/album.dto";
import { CreateAlbumDto } from "./dto/create-album.dto";

@Injectable()
export class AlbumsService {
    private albums: AlbumDto[] = [];

    findAll(): AlbumDto[] {
        return this.albums;
    }

    findOne(albumId: string): AlbumDto | DbEnum {
        const album = this.albums.find((album) => album.id === albumId);
        if (!album) return DbEnum.notFound;

        return album;
    }

    create(albumForCreate: CreateAlbumDto): AlbumDto {
        const createdAlbum: AlbumDto = {
            id: this._createId(),
            ...albumForCreate
        };

        this.albums.push(createdAlbum);

        return createdAlbum;
    }

    updateAlbum(albumId: string, newAlbumData: CreateAlbumDto): AlbumDto | DbEnum {
        const albumForUpdate = this.albums.find((album) => album.id === albumId);

        if (!albumForUpdate) {
            return DbEnum.notFound;
        };
 
        albumForUpdate.artistId = newAlbumData.artistId;
        albumForUpdate.name = newAlbumData.name;
        albumForUpdate.year = newAlbumData.year;
        
        return albumForUpdate;
    }

    delete(albumId: string): DbEnum | string {
        const album = this.albums.find((album) => album.id === albumId);

        if(!album) {
            return DbEnum.notFound;
        };

        const deleteAlbumIndex = this.albums.indexOf(album);
        this.albums.splice(deleteAlbumIndex);

        return 'Album was deleted!';
    }

    _createId(): string {
        return uuid();
    }
};
