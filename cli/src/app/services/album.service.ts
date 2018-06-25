import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getAlbums(token, artistId = null){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };
        
        if (artistId == null) {
            return this._http.get(this.url+'albums/', httpOptions)
            .pipe(map((res: Response) => res));
        } else {
            return this._http.get(this.url+'albums/'+artistId, httpOptions)
            .pipe(map((res: Response) => res));
        }  
    }

    getAlbum(token, id: string){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.get(this.url+'album/'+id, httpOptions)
        .pipe(map((res: Response) => res));
    }

    addAlbum(token, album: Album){

        let params = JSON.stringify(album);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.post(this.url+'album', params, httpOptions)
        .pipe(map((res: Response) => res));
    }

    editAlbum(token, id: string, album: Album){

        let params = JSON.stringify(album);

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };

        return this._http.put(this.url+'album/'+id, params, httpOptions)
        .pipe(map((res: Response) => res));
    }

    deleteAlbum(token, id: string){
        
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type' :'application/json',
                'Authorization': token
            })
        };
       
        return this._http.delete(this.url+'album/'+id, httpOptions)
        .pipe(map((res: Response) => res));
    }
}