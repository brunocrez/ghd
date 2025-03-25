import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductService } from './services/product.service';
import { of } from 'rxjs';

const mockProducts = [
  { id: 1, name: 'Product Alpha' },
  { id: 2, name: 'Product Beta' },
  { id: 3, name: 'Product Omega' },
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpMock: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    httpMock = jasmine.createSpyObj('ProductService', ['load']);
    httpMock.load.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: ProductService, useValue: httpMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.inputText).toBe('');
    expect(component.filterOption).toBe('asc');
  });

  it('should load products on init', fakeAsync(() => {
    httpMock.load.and.returnValue(of(mockProducts));

    fixture.detectChanges();
    tick(1000);

    expect(httpMock.load).toHaveBeenCalled();

    component.products$.subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });
  }));

  it('should change sort order', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    component.filterOption = 'desc';
    component.onSortChange();

    expect(httpMock.load).toHaveBeenCalledWith('desc', '');
  }));

  it('should filter products after input change', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    component.inputText = 'Alpha';
    component.onInputChange();

    tick(500);

    expect(httpMock.load).toHaveBeenCalledWith('asc', 'Alpha');
  }));
});
