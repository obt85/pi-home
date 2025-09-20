import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from '../../../environments/environment';

export interface PirState {
  pin: number;
  state: number;
  error?: string;
}

@Injectable()
export class PirService {

  private baseUrl = environment.apiPir; // proxy vers ton serveur RPi sur le port 4200

  constructor(private http: HttpClient) { }

  getPirState(pin: number): Observable<PirState> {
    return this.http.get<PirState>(`${this.baseUrl}/${pin}`)
      .catch((error: any) => {
        console.error('PirService error:', error);
        return Observable.throw(error || 'Server error');
      });
  }

  getPir1(): Observable<PirState> {
    return this.getPirState(11);
  }

  getPir2(): Observable<PirState> {
    return this.getPirState(20);
  }
}
