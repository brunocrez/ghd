import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data and return it', () => {
    const products = [{ id: 1, name: 'product 1' }];

    service.load().subscribe((p) => expect(p).toEqual(products));

    const req = httpTesting.expectOne(
      'http://localhost:3000/products?_sort=name&_order=asc&name_like='
    );

    expect(req.request.method).toBe('GET');
    req.flush(products);
  });
});
