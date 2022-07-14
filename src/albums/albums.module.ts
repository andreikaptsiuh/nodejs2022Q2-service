import { Module } from "@nestjs/common";
import { TracksService } from "src/tracks/tracks.service";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";

@Module({
    providers: [AlbumsService, TracksService],
    controllers: [AlbumsController]
})

export class AlbumsModule {};
