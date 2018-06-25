import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';

import { ArtistListComponent } from './components/artist-list.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';

import { AlbumAddComponent } from './components/album-add.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumEditComponent } from './components/album-edit.component';

import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

const appRoutes: Routes = [
    {path:'', component: HomeComponent},

    {path:'artist/create', component: ArtistAddComponent},
    {path:'artists/:page', component: ArtistListComponent},
    {path:'artist/:id', component: ArtistDetailComponent},
    {path:'artist/update/:id', component: ArtistEditComponent},
    {path:'album/create/:artist', component: AlbumAddComponent},
    {path:'album/update/:id', component: AlbumEditComponent},
    {path:'album/:id', component: AlbumDetailComponent},
    {path:'song/create/:album', component: SongAddComponent},
    {path:'song/update/:id', component: SongEditComponent},
    {path:'account', component: UserEditComponent},
    {path:'**', component: ArtistListComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);