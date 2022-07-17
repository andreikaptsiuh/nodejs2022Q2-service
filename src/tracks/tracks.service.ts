import { Injectable } from '@nestjs/common';
import { DbEnum } from 'src/untils/dbEnum';
import { v4 as uuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackDto } from './dto/track.dto';

const TRACKS_DB: TrackDto[] = [];

@Injectable()
export class TracksService {
  findAll(): TrackDto[] {
    return TRACKS_DB;
  }

  findOne(trackId: string): TrackDto | DbEnum.notFound {
    const track = TRACKS_DB.find((track) => track.id === trackId);
    if (!track) return DbEnum.notFound;

    return track;
  }

  create(trackForCreate: CreateTrackDto): TrackDto {
    const createdTrack: TrackDto = {
      id: this._createId(),
      ...trackForCreate,
    };

    TRACKS_DB.push(createdTrack);

    return createdTrack;
  }

  updateTrack(
    trackId: string,
    newTrackData: CreateTrackDto,
  ): TrackDto | DbEnum {
    const trackForUpdate = TRACKS_DB.find((track) => track.id === trackId);

    if (!trackForUpdate) {
      return DbEnum.notFound;
    }

    trackForUpdate.albumId = newTrackData.albumId;
    trackForUpdate.artistId = newTrackData.artistId;
    trackForUpdate.duration = newTrackData.duration;
    trackForUpdate.name = newTrackData.name;

    return trackForUpdate;
  }

  delete(trackId: string): DbEnum | string {
    const artist = TRACKS_DB.find((track) => track.id === trackId);

    if (!artist) {
      return DbEnum.notFound;
    }

    const deleteTrackIndex = TRACKS_DB.indexOf(artist);
    TRACKS_DB.splice(deleteTrackIndex);

    return 'Artist was deleted!';
  }

  _createId(): string {
    return uuid();
  }
}
