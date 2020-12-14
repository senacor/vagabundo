import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { GranularityViewLevel } from '@models/granularityViewLevel';

@Injectable({
  providedIn: 'root'
})
export class StatsSelectionService {
  private mySelectionSubject: Subject<GranularityViewLevel> = null;

  constructor() {
    this.mySelectionSubject = new BehaviorSubject<GranularityViewLevel>(GranularityViewLevel.Traveller);
  }

  public getSelectedStats(): Observable<GranularityViewLevel> {
    return this.mySelectionSubject.asObservable();
  }

  public selectStats(stats: GranularityViewLevel): void {
    this.mySelectionSubject.next(stats);
  }
}
