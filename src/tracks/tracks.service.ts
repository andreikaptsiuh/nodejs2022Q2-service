import { Injectable } from "@nestjs/common";
import { DbEnum } from "src/untils/dbEnum";
import { v4 as uuid } from 'uuid';
import { CreateTrackDto } from "./dto/create-track.dto";
import { TrackDto } from "./dto/track.dto";

@Injectable()
export class TracksService {
    private tracks: TrackDto[] = [];

    findAll(): TrackDto[] {
        return this.tracks;
    }

    findOne(trackId: string): TrackDto | DbEnum {
        const track = this.tracks.find((track) => track.id === trackId);
        if (!track) return DbEnum.notFound;

        return track;
    }

    create(trackForCreate: CreateTrackDto): TrackDto {
        const createdTrack: TrackDto = {
            id: this._createId(),
            ...trackForCreate
        };

        this.tracks.push(createdTrack);

        return createdTrack;
    }

    updateTrack(trackId: string, newTrackData: CreateTrackDto): TrackDto | DbEnum {
        const trackForUpdate = this.tracks.find((track) => track.id === trackId);

        if (!trackForUpdate) {
            return DbEnum.notFound;
        };
 
        trackForUpdate.albumId = newTrackData.albumId;
        trackForUpdate.artistId = newTrackData.artistId;
        trackForUpdate.duration = newTrackData.duration;
        trackForUpdate.name = newTrackData.name;
        
        return trackForUpdate;
    }

    delete(trackId: string): DbEnum | string {
        const artist = this.tracks.find((track) => track.id === trackId);

        if(!artist) {
            return DbEnum.notFound;
        };

        const deleteTrackIndex = this.tracks.indexOf(artist);
        this.tracks.splice(deleteTrackIndex);

        return 'Artist was deleted!';
    }

    _createId(): string {
        return uuid();
    }
};
