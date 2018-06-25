import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getSongs(token, albumId = null){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };
        
        if (albumId == null) {
            return this._http.get(this.url+'songs/', httpOptions)
            .pipe(map((res: Response) => res));
        } else {
            return this._http.get(this.url+'songs/'+albumId, httpOptions)
            .pipe(map((res: Response) => res));
        }  
    }

    getSong(token, id: string){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.get(this.url+'song/'+id, httpOptions)
        .pipe(map((res: Response) => res));
    }

    addSong(token, song: Song){

        let params = JSON.stringify(song);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.post(this.url+'song', params, httpOptions)
        .pipe(map((res: Response) => res));
    }

    editSong(token, id: string, song: Song){

        let params = JSON.stringify(song);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.put(this.url+'song/'+id, params, httpOptions)
        .pipe(map((res: Response) => res));
    }

    deleteSong(token, id: string){
        
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };
       
        return this._http.delete(this.url+'song/'+id, httpOptions)
        .pipe(map((res: Response) => res));
    }
}