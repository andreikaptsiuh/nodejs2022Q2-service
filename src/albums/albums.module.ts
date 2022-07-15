import { Module } from "@nestjs/common";
import { FavoritesService } from "src/favorites/favorites.service";
import { TracksService } from "src/tracks/tracks.service";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";

@Module({
    providers: [AlbumsService, TracksService, FavoritesService],
    controllers: [AlbumsController]
})

export class AlbumsModule {};
