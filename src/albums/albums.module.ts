import { Module } from "@nestjs/common";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";

@Module({
    providers: [AlbumsService],
    controllers: [AlbumsController]
})

export class AlbumsModule {};
