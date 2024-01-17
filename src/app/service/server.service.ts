import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {CustomResponse} from "../interface/cuctom-response";
import {Server} from "../interface/server";

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly BASE_URL = 'http://localhost:8080/servers'

  constructor(private httpClient: HttpClient) {
  }

  server$: Observable<CustomResponse> = this.httpClient.get<CustomResponse>(this.BASE_URL).pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ = (server: Server): Observable<CustomResponse> =>
    this.httpClient.post<CustomResponse>(this.BASE_URL, server).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  ping$ = (ipAddress: string): Observable<CustomResponse> =>
    this.httpClient.get<CustomResponse>(`${this.BASE_URL}/ping/${ipAddress}`).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  delete$ = (serverId: string): Observable<CustomResponse> =>
    this.httpClient.delete<CustomResponse>(`${this.BASE_URL}/${serverId}`).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError(() => error)
  }
}
