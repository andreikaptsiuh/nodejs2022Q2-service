import { Injectable } from "@nestjs/common";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { ArtistDto } from "./dto/artist.dto";
import { v4 as uuid } from 'uuid';
import { DbEnum } from "src/untils/dbEnum";
import { UpdateArtistDto } from "./dto/update-artist.dto";

@Injectable()
export class ArtistsService {
    private artists: ArtistDto[] = [];

    findAll(): ArtistDto[] {
        return this.artists;
    }

    findOne(artistId: string): ArtistDto | DbEnum {
        const artist = this.artists.find((artist) => artist.id === artistId);
        if (!artist) return DbEnum.notFound;

        return artist;
    }

    create(artistForCreate: CreateArtistDto): ArtistDto {
        const createdartist: ArtistDto = {
            id: this._createArtistId(),
            ...artistForCreate
        };

        this.artists.push(createdartist);

        return createdartist;
    }

    updateArtist(artistId: string, newArtistData: UpdateArtistDto): ArtistDto | DbEnum {
        const artistForUpdate = this.artists.find((artist) => artist.id === artistId);

        if (!artistForUpdate) {
            return DbEnum.notFound;
        }
 
        if (newArtistData.grammy !== undefined) {
            artistForUpdate.grammy = newArtistData.grammy;
        }

        if (newArtistData.name !== undefined) {
            artistForUpdate.name = newArtistData.name;
        }
        
        return artistForUpdate;
    }

    delete(artistId: string): DbEnum | string {
        const artist = this.artists.find((artist) => artist.id === artistId);

        if(!artist) {
            return DbEnum.notFound;
        };

        const deleteartistIndex = this.artists.indexOf(artist);
        this.artists.splice(deleteartistIndex);

        return 'Artist was deleted!';
    }

    _createArtistId(): string {
        return uuid();
    };
}
