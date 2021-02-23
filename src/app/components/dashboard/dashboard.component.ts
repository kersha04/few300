import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TodoListItem } from 'src/app/models';
import { AppState, selectInboxItems } from 'src/app/reducers';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  inboxItems$: Observable<TodoListItem[]>;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.inboxItems$ = this.store.select(selectInboxItems);
    this.route.queryParams.subscribe(params => {
      if (params.inbox) {
        this.showInbox();
      }
      if (params.project) {
        this.showProject(params.project);
      }
    });
  }

  private showInbox(): void {
    const dlg = this.dialog.open(ListComponent, { disableClose: true, data: { filter: 'inbox' } });

    // trims url ?inbox=true from url after dialog closes
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }

  private showProject(id: string): void {
    const dlg = this.dialog.open(ListComponent, { disableClose: true, data: { filter: 'project', id } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }
}
