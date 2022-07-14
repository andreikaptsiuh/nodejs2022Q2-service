import { Module } from "@nestjs/common";
import { TracksController } from "./tracks.controller";
import { TracksService } from "./tracks.service";

@Module({
    providers: [TracksService],
    controllers: [TracksController]
})

export class TracksModule {};
