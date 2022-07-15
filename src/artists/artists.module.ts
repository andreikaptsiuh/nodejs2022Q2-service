import { Module } from "@nestjs/common";
import { FavoritesService } from "src/favorites/favorites.service";
import { TracksService } from "src/tracks/tracks.service";
import { ArtistsController } from "./artists.controller";
import { ArtistsService } from "./artists.service";

@Module({
    providers: [ArtistsService, TracksService, FavoritesService],
    controllers: [ArtistsController]
})

export class ArtistsModule {}
