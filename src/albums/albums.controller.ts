import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { AlbumsService } from './albums.service';
import { AlbumDto } from './dto/album.dto';
import { DbEnum } from 'src/untils/dbEnum';
import { CreateAlbumDto } from './dto/create-album.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';

@Controller('album')
export class AlbumsController {
    constructor(
        private readonly albumsService: AlbumsService,
        private readonly tracksService: TracksService
    ) {}

    @Get()
    findAll(): AlbumDto[] {
        return this.albumsService.findAll();
    }

    @Get(':id')
    findOne(@Res({ passthrough: true }) res: Response, @Param('id') id: string): AlbumDto | string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.albumsService.findOne(id);

        if(result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `Album with id: ${id} not found`;
        };

        return result as AlbumDto;
    }

    @Post()
    create(@Res({ passthrough: true }) res: Response, @Body() createAlbum: CreateAlbumDto): AlbumDto | string {
        if (
                createAlbum.artistId === undefined || 
                typeof createAlbum.name !== 'string' || 
                typeof createAlbum.year !== 'number'
            ) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Name, year and artistId fields is required!';
        };

        return this.albumsService.create(createAlbum);
    }

    @Put(':id')
    update(@Res({ passthrough: true }) res: Response, @Param('id') id: string, @Body() newAlbumData: CreateAlbumDto): AlbumDto | string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        if (
            newAlbumData.artistId === undefined || 
            typeof newAlbumData.name !== 'string' || 
            typeof newAlbumData.year !== 'number'
        ) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Name, year and artistId fields is required!';
        }

        const result = this.albumsService.updateAlbum(id, newAlbumData);

        if(result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `Album with id: ${id} not found`;
        };

        return result as AlbumDto;
    }

    @Delete(':id')
    delete(@Res({ passthrough: true }) res: Response, @Param('id') id: string): string {
        if (!validate(id)) {
            res.status(HttpStatus.BAD_REQUEST);
            return 'Id not valid';
        };

        const result = this.albumsService.delete(id);

        if(result === DbEnum.notFound) {
            res.status(HttpStatus.NOT_FOUND);
            return `Album with id: ${id} not found`;
        };

        const allTracks = this.tracksService.findAll();
        const albumTracks = allTracks.filter((track) => track.albumId === id);

        albumTracks?.forEach((track) => {
            const updatedTrack: CreateTrackDto = {
                ...track,
                albumId: null
            };
            
            this.tracksService.updateTrack(track.id, updatedTrack);
        });

        res.status(HttpStatus.NO_CONTENT);
        return result as string;
    }
};
