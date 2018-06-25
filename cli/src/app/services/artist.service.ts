import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }
    
    getArtists(token, page){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.get(this.url+'artists/'+page, httpOptions)
        .pipe(map((res: Response) => res));
    }

    getArtist(token, id: string){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.get(this.url+'artist/'+id, httpOptions)
        .pipe(map((res: Response) => res));
    }

    addArtist(token, artist: Artist){

        let params = JSON.stringify(artist);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.post(this.url+'artist', params, httpOptions)
        .pipe(map((res: Response) => res));
    }

    editArtist(token, id: string, artist: Artist){

        let params = JSON.stringify(artist);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.put(this.url+'artist/'+id, params, httpOptions)
        .pipe(map((res: Response) => res));
    }

    deleteArtist(token, id: string){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.delete(this.url+'artist/'+id, httpOptions)
        .pipe(map((res: Response) => res));
    }
}