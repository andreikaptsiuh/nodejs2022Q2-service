import { Module } from "@nestjs/common";
import { ArtistsController } from "./artists.controller";
import { ArtistsService } from "./artists.service";

@Module({
    providers: [ArtistsService],
    controllers: [ArtistsController]
})

export class ArtistsModule {}
