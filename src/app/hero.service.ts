import {Injectable} from '@angular/core';
import {Hero} from './domain/Hero';
import {Observable} from 'rxjs/Observable';
import {MessageService} from './message.service';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {HttpHeaders, HttpClient} from '@angular/common/http';


const ROOT = 'http://localhost:4202/hero';

@Injectable()
export class HeroService {

  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  getHeroes(): Observable<Hero []> {
    return this.http.get<Hero[]>(ROOT, this.httpOptions).pipe(
      tap(heroes => this.log('fetched heroes')),
      catchError(this.handleError('getHeroes', []))
    );
  }


  getHero(id: string): Observable<Hero> {
    const url = `${ROOT}/${id}`;
    return this.http.get<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(ROOT, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`update hero id ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(ROOT, hero, this.httpOptions).pipe(
      tap((hero_: Hero) => this.log(`added hero w/ id=${hero_.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${ROOT}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  deleteAll(): void {
    this.http.delete(ROOT + '/all', this.httpOptions);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(ROOT + `/name?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }




  getGreet(): Observable<any> {
    // return this.httpForTest.get(this.root + '/greet')
    //   .toPromise()
    //   .then(response => response.text());

    return this.http.get(ROOT + '/greet', this.httpOptions).pipe(
      tap(greet => this.log('fetched greetings')),
      catchError(this.handleError('getGreetings', []))
    );
  }

  private log(message: string) {
    this.messageService.add(message);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`
  ${operation}
  failed:
  ${error.message}
`);
      return of(result as T);
    };
  }

}
