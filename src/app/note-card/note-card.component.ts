import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements AfterViewInit {
  @Input()title: string;
  @Input()body: string;
  @Input()link: string;
  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('truncator') truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText: ElementRef<HTMLElement>;
  // tslint:disable-next-line:variable-name
  constructor(private _renderer: Renderer2) { }

  ngAfterViewInit(): void{
    let style: CSSStyleDeclaration;
    style = window.getComputedStyle(this.bodyText.nativeElement, null);
    const viewableHeight = parseInt(style.getPropertyValue('height'), 10);
    if (this.bodyText.nativeElement.scrollHeight > viewableHeight){
      console.log('here');
      this._renderer.setStyle(this.truncator.nativeElement, 'display', '');
    }
    else {
      console.log('there');
      this._renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }
  onXButtonClick(){
    this.deleteEvent.emit();
  }
}
