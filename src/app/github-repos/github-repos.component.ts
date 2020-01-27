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

  public loading = false;
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

  private getRepositories() {
    this.loading = false;
    const query = `created:>${GithubReposComponent.getDateRange()}`;
    this.subs = this.githubService.getRepositories(query, this.currentPage)
      .pipe(retry(2))
      .subscribe(result => {
        this.repoList = result.items;
        // this.repoList.forEach(x => {
        //   this.getAvatar(x.owner.id, x.owner.avatar_url);
        // });
      }, error => {
      });
  }
}
