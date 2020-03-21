import { Component, OnInit, OnDestroy } from '@angular/core';
import { LibraryLoadersService } from './services/library-loaders.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerDataService } from './services/logger-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'labirin-bolang';

  subscriptions: Subscription = new Subscription();


  constructor(
    private readonly loaderLib: LibraryLoadersService,
    private readonly loggers: LoggerDataService) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.loadLibraryJS();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadLibraryJS() {
    const subs = this.loaderLib.loadViewLibrary().subscribe(
      () => {
        this.loggers.logData('Library loaded');
      },
      (error) => {
        this.loggers.logData(error);
      }
    );

    this.subscriptions.add(subs);
  }
}
