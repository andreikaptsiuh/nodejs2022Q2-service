import { Module } from "@nestjs/common";
import { TracksService } from "src/tracks/tracks.service";
import { ArtistsController } from "./artists.controller";
import { ArtistsService } from "./artists.service";

@Module({
    providers: [ArtistsService, TracksService],
    controllers: [ArtistsController]
})

export class ArtistsModule {}
