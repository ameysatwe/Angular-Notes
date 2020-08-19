import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoteslistComponent} from './pages/noteslist/noteslist.component';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {NoteDetailsComponent} from './pages/note-details/note-details.component';

const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
      {path: '', component: NoteslistComponent},
      {path: 'new', component: NoteDetailsComponent},
      {path: ':id', component: NoteDetailsComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
