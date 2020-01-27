import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private url = 'https://api.github.com/search/repositories';

  constructor(private http: HttpClient) {
  }

  public getRepositories(query: string = 'created', page = 1, sort = 'stars', order = 'desc') {
    const params = new HttpParams({
        fromObject: {
          q: query,
          page: page.toString(10),
          sort,
          order
        }
      }
    );
    return this.http.get<any>(this.url, {params});
  }

  public getAvatars(url: string) {
    return this.http.get(url);
  }

}
