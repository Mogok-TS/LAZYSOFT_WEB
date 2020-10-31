import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor() { }

  warehouses = [
    { id: 1, name: 'Yangon Warehouse' },
    { id: 2, name: 'Mandalay Warehouse' },
    { id: 3, name: 'Mogok Warehouse' },
    { id: 4, name: 'Naypyidaw Warehouse' },
    { id: 5, name: 'Myingyan Warehouse' },
  ]

  getWarehouseList(){
    return this.warehouses;
  }

}
