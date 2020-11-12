import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import Grocery from '@models/grocery';

@Injectable({
  providedIn: 'root'
})
export class GroceryItemService {

  constructor(private storage: Storage) { }

  public async getAll(): Promise<Array<Grocery>> {
    const storageVal = await this._getFromStorage();
    return storageVal;
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

  private async _addToStorage(groceries) {
    await this.storage.set('groceries', JSON.stringify(groceries));
  }
}
