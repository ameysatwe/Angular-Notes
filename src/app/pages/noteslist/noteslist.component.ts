import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Note} from '../../shared/note.model';
import {NotesService} from '../../shared/notes.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {not} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-noteslist',
  templateUrl: './noteslist.component.html',
  styleUrls: ['./noteslist.component.scss'],
  animations: [
    trigger('itemAnim', [
      // entry animation
      transition('void => *', [
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom':  0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
        }),
        animate('50ms', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*'
        })),
        animate(200)
      ]),
      transition( '* => void', [
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75,
        })),
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),
        animate('150ms ease-out', style({
          height: 0,
          paddingTop: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          paddingRight: 0,
          'margin-bottom': '0',
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class NoteslistComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef:ElementRef<HTMLInputElement>;
  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    console.log('here');
    this.notes = this.notesService.getAll();
    //this.filteredNotes=this.notesService.getAll();
    this.filter(' ');
  }
  deleteNote(note: Note): any {
    let noteId=this.notesService.getId(note)
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }
  generateNoteUrl(note:Note){
    return this.notesService.getId(note)

  }
  filter(str: string): any {
    const q: string = str.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    let terms: string[] = q.split(' ');
    terms = this.removeDuplicates(terms);
    terms.forEach(term=>{
      let results : Note[] = this.relevantNotes(term);
      allResults = [...allResults,...results];
    })
    this.filteredNotes = this.removeDuplicates(allResults);
    //relevancy sort
    this.sortByRelevancy(allResults);
  }
  removeDuplicates(arr: Array<any>): Array<any>{
    const uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }
  relevantNotes(q: string){
    q = q.toLowerCase().trim();
    const relevantNotes = this.notes.filter(note => {
      if  (note.title && note.title.toLowerCase().includes(q)){
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(q))
      {
        return true;
      }
      else return false;
    });
    return relevantNotes;
  }
  sortByRelevancy(searchResults: Note[]){
    let noteCountObj:Object={};
    searchResults.forEach(note=>{
      let noteId=this.notesService.getId(note);
      if(noteCountObj[noteId]){
        noteCountObj[noteId]+=1;
      }
      else {
        noteCountObj[noteId]=1;
      }
    })
    this.filteredNotes=this.filteredNotes.sort((a:Note,b:Note)=>{
      let aId=this.notesService.getId(a);
      let bId=this.notesService.getId(b);

      let acount=noteCountObj[aId];
      let bcount=noteCountObj[bId];

      return bcount-acount;
    })
  }
}
