import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {tap, catchError} from "rxjs/operators";
import {CustomResponse} from "../interface/cuctom-response";
import {Server} from "../interface/server";
import {Status} from "../enum/status.enum";

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly BASE_URL = 'http://localhost:8080/servers'

  constructor(private httpClient: HttpClient) {
  }

  server$: Observable<CustomResponse> = this.httpClient.get<CustomResponse>(this.BASE_URL)
    .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ = (server: Server): Observable<CustomResponse> =>
    this.httpClient.post<CustomResponse>(this.BASE_URL, server)
      .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  ping$ = (ipAddress: string): Observable<CustomResponse> =>
    this.httpClient.get<CustomResponse>(`${this.BASE_URL}/ping/${ipAddress}`)
      .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  filter$ = (status: Status, response: CustomResponse): Observable<CustomResponse> =>
    new Observable(
      subscriber => {
        console.log(response)
        subscriber.next(
          status === Status.ALL
            ? {...response, message: `Severs filtered by ${status} status`}
            : {
            ...response,
            message: response.data.servers?.some((server) => server.status === status)
              ? `Severs filtered by ${status} status`
              : `No servers of ${status} found`,
            data: response.data.servers?.filter(server => server.status === status)
            }
        );
        subscriber.complete();
      }
    ).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  delete$ = (serverId: string): Observable<CustomResponse> =>
    this.httpClient.delete<CustomResponse>(`${this.BASE_URL}/${serverId}`)
      .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError(() => new Error (`An error occurred - Error code: ${error.status}`))
  }
}
