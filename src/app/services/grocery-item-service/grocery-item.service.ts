import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import Grocery from '@models/grocery';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GroceryItemService {
  public groceries = new BehaviorSubject<Array<Grocery>>([]);

  constructor(private storage: Storage) { }

  public async getAll(): Promise<Array<Grocery>> {
    return await this._getFromStorage();
  }

  public async get(name: string): Promise<Grocery> {
    return (await this.getAll()).find(value => value.name === name);
  }

  public async create(grocery: Grocery) {
    let groceries = await this.getAll()
    groceries = [...groceries, grocery];
    await this._addToStorage(groceries);
  }

  public async update(grocery: Grocery) {
    const groceries = (await this.getAll()).map(_grocery => (_grocery.name === grocery.name) ? grocery : _grocery);
    await this._addToStorage(groceries);
  }

  public async delete(grocery: Grocery) {
    const groceries = (await this.getAll()).filter(_grocery => _grocery.name !== grocery.name);
    await this._addToStorage(groceries);
  }

  private async _getFromStorage() {
    return JSON.parse(await this.storage.get('groceries') || '[]');
  }

  private async _addToStorage(groceries: Array<Grocery>) {
    this._postNewGroceryValue(groceries);
    await this.storage.set('groceries', JSON.stringify(groceries));
  }

  private _postNewGroceryValue(groceries: Array<Grocery>) {
    return this.groceries.next(groceries);
  }
}
