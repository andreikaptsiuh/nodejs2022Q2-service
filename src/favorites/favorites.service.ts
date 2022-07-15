import { Injectable } from "@nestjs/common";
import { DbEnum } from "src/untils/dbEnum";
import { FavoritesDto } from "./dto/favorites.dto";

const FAVORITES_DB: FavoritesDto = { artists: [], albums: [], tracks: []};

@Injectable()
export class FavoritesService {
    findAllFavorites(): FavoritesDto {
        return FAVORITES_DB;
    }

    // Artists
    addFavoriteArtist(artistId: string): string {
        FAVORITES_DB.artists.push(artistId);
        return 'Artist added to favorites!';
    }

    deleteFavoriteArtist(artistId: string): string | DbEnum.notFound {
        const artist = FAVORITES_DB.artists.find((id) => id === artistId);

        if(!artist) {
            return DbEnum.notFound;
        };

        const deleteartistIndex = FAVORITES_DB.artists.indexOf(artist);
        FAVORITES_DB.artists.splice(deleteartistIndex);

        return 'Artist deleted from favorites!';
    }

    // Albums
    addFavoriteAlbum(albumtId: string): string {
        FAVORITES_DB.albums.push(albumtId);
        return 'Album added to favorites!';
    }

    deleteFavoriteAlbum(albumtId: string): string | DbEnum.notFound {
        const album = FAVORITES_DB.albums.find((id) => id === albumtId);

        if(!album) {
            return DbEnum.notFound;
        };

        const deleteartistIndex = FAVORITES_DB.albums.indexOf(album);
        FAVORITES_DB.albums.splice(deleteartistIndex);

        return 'Album deleted from favorites!';
    }

    // Tracks
    addFavoriteTrack(trackId: string): string {
        FAVORITES_DB.tracks.push(trackId);
        return 'Track added to favorites!';
    }

    deleteFavoriteTrack(trackId: string): string | DbEnum.notFound {
        const track = FAVORITES_DB.tracks.find((id) => id === trackId);

        if(!track) {
            return DbEnum.notFound;
        };

        const deleteartistIndex = FAVORITES_DB.tracks.indexOf(track);
        FAVORITES_DB.tracks.splice(deleteartistIndex);

        return 'Track deleted from favorites!';
    }
};
