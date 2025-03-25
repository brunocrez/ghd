import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/product.service';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule, AsyncPipe, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  private readonly MIN_LENGTH_TO_DEBOUNCE = 4;
  private service = inject(ProductService);
  private inputTextChanges = new BehaviorSubject<string>('');
  private sortChanges = new BehaviorSubject<'asc' | 'desc'>('asc');

  inputText = '';
  filterOption: 'asc' | 'desc' = 'asc';

  products$ = combineLatest([this.getSortOrder(), this.getFilterText()]).pipe(
    switchMap(([sortOrder, text]) => {
      return this.service.load(sortOrder, text);
    })
  );

  private getFilterText() {
    return this.inputTextChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    );
  }

  private getSortOrder() {
    return this.sortChanges;
  }

  onSortChange() {
    this.sortChanges.next(this.filterOption);
  }

  onInputChange() {
    if (
      this.inputText.length >= this.MIN_LENGTH_TO_DEBOUNCE ||
      this.inputText.length === 0
    ) {
      this.inputTextChanges.next(this.inputText);
    }
  }

  ngOnDestroy(): void {
    this.inputTextChanges.complete();
    this.sortChanges.complete();
  }
}
