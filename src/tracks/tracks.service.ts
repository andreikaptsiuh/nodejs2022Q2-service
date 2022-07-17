import { Injectable } from '@nestjs/common';
import { TRACKS_DB } from 'src/myDb/myDb';
import { DbEnum } from 'src/untils/dbEnum';
import { v4 as uuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TracksService {
  async findAll(): Promise<TrackDto[]> {
    return TRACKS_DB;
  }

  async findOne(trackId: string): Promise<TrackDto | DbEnum.notFound> {
    const track = TRACKS_DB.find((track) => track.id === trackId);
    if (!track) return DbEnum.notFound;

    return track;
  }

  async create(trackForCreate: CreateTrackDto): Promise<TrackDto> {
    const createdTrack: TrackDto = {
      id: this._createId(),
      ...trackForCreate,
    };

    TRACKS_DB.push(createdTrack);

    return createdTrack;
  }

  async updateTrack(
    trackId: string,
    newTrackData: CreateTrackDto,
  ): Promise<TrackDto | DbEnum> {
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

  async delete(trackId: string): Promise<string | DbEnum> {
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
