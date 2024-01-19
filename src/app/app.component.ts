import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {ServerService} from "./service/server.service";
import {map, Observable, of, startWith} from "rxjs";
import {AppState} from "./interface/app-state";
import {CustomResponse} from "./interface/cuctom-response";
import {DataState} from "./enum/data-state.enum";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  appState$: Observable<AppState<CustomResponse>>;

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.server$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED_STATE, appDate: response}
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: HttpErrorResponse) => of({ dataState: DataState.ERROR_STATE, error: error.message }))
      )
  }
}
