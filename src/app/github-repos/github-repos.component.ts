import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from '../services/github.service';
import {differenceInDays, differenceInHours, format, parseISO, subDays} from 'date-fns';
import {Subscription} from 'rxjs';
import {retry} from 'rxjs/operators';
import {GithubRepoModel} from '../models/github/github-repo.model';
import {GlobalErrorHandler} from '../core/errors/global-error-handler';

@Component({
  selector: 'app-github-repos',
  templateUrl: './github-repos.component.html',
  styleUrls: ['./github-repos.component.css']
})
export class GithubReposComponent implements OnInit, OnDestroy {

  public loading = true;
  public repoList = new Array<GithubRepoModel>();
  private subs = new Subscription();
  private currentPage = 1;

  constructor(private githubService: GithubService) {
  }

  static getDateRange() {
    return format(subDays(new Date(), 30), 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.getRepositories();
  }

  /*
   * Unsubscription to avoid memory leak
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /*
   * Get the number of days between the last time a repository has been updated and the moment when the repository is fetched.
   * if the repository has been updated less that 24 hours, return the number of hours.
   */
  public getTimeInterval(pushedAt: Date) {
    let difference = differenceInDays(new Date(), parseISO(pushedAt.toString()));
    if (Number(difference) === 0) {
      difference = differenceInHours(new Date(), parseISO(pushedAt.toString()));
      return `${difference} hour${Number(difference) > 1 ? 's' : ''}`;
    }
    return `${difference} day${Number(difference) > 1 ? 's' : ''}`;
  }

  // update the current page according to the clicked button and fetch the repositories
  public doPagination(goNext: boolean) {
    goNext ? ++this.currentPage : --this.currentPage;
    this.repoList.splice(0);
    this.loading = true;
    this.getRepositories();
  }

  private getRepositories() {
    const query = `created:>${GithubReposComponent.getDateRange()}`;
    this.subs = this.githubService.getRepositories(query, this.currentPage)
      .pipe(retry(2))
      .subscribe(result => {
        this.repoList = result.items;
        this.loading = false;
      }, error => console.log(new GlobalErrorHandler().handleError(error)));
  }
}
