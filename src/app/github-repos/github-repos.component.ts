import {Component, OnDestroy, OnInit} from '@angular/core';
import {GithubService} from '../services/github.service';
import {differenceInDays, differenceInHours, format, parseISO, subDays} from 'date-fns';
import {Subscription} from 'rxjs';
import {retry} from 'rxjs/operators';
import {GithubRepoModel} from '../models/github/github-repo.model';

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
    setTimeout(() => this.getRepositories(), 4000);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public getTimeInterval(pushedAt: Date) {
    let difference = differenceInDays(new Date(), parseISO(pushedAt.toString()));
    if (Number(difference) === 0) {
      difference = differenceInHours(new Date(), parseISO(pushedAt.toString()));
      return `${difference} hour${Number(difference) > 1 ? 's' : ''}`;
    }
    return `${difference} day${Number(difference) > 1 ? 's' : ''}`;
  }

  doPagination(goNext: boolean) {
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
      }, error => {
      });
  }
}
