import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { TrackDto } from './dto/track.dto';
import { TracksService } from './tracks.service';
import { DbEnum } from 'src/untils/dbEnum';
import { CreateTrackDto } from './dto/create-track.dto';
import { FavoritesService } from 'src/favorites/favorites.service';

@Controller('track')
export class TracksController {
    constructor(
        private readonly tracksService: TracksService,
        private readonly favoritesService: FavoritesService
    ) {}

    @Get()
    findAll(): TrackDto[] {
        return this.tracksService.findAll();
    }

    @Get(':id')
    findOne(@Res({ passthrough: true }) res: Response, @Param('id') id: string): TrackDto | string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.tracksService.findOne(id);

        if (result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `Track with id: ${id} not found`;
        };

        return result as TrackDto;
    }

    @Post()
    create(@Res({ passthrough: true }) res: Response, @Body() createTrack: CreateTrackDto): TrackDto | string {
        if (
                createTrack.albumId === undefined || 
                createTrack.artistId === undefined || 
                typeof createTrack.duration !== 'number' ||
                typeof createTrack.name !== 'string'
            ) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Name, duration, artistId and albumId fields is required!';
        };

        return this.tracksService.create(createTrack);
    }

    @Put(':id')
    update(@Res({ passthrough: true }) res: Response, @Param('id') id: string, @Body() newTracktData: CreateTrackDto): TrackDto | string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        if (
            newTracktData.albumId === undefined || 
            newTracktData.artistId === undefined || 
            typeof newTracktData.duration !== 'number' ||
            typeof newTracktData.name !== 'string'
        ) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Name, duration, artistId and albumId fields is required!';
        }

        const result = this.tracksService.updateTrack(id, newTracktData);

        if (result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `Track with id: ${id} not found`;
        };

        return result as TrackDto;
    }

    @Delete(':id')
    delete(@Res({ passthrough: true }) res: Response, @Param('id') id: string): string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.tracksService.delete(id);

        if (result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `Track with id: ${id} not found`;
        };

        this.favoritesService.deleteFavoriteTrack(id);

        res.status(HttpStatus.NO_CONTENT);
        return result as string;
    }
};
