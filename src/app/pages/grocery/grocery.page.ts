import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import Grocery from '@models/grocery';
import { GroceryItemService, GroceryDialogService } from '@services';
import { ToastClass } from '@types';

@Component({
  selector: 'grocery-tab',
  templateUrl: 'grocery.page.html',
  styleUrls: ['grocery.page.scss']
})
export class GroceryPage implements OnInit {
  groceries: Array<Grocery> = [];

  constructor(
      private toastController: ToastController,
      private groceryItemService: GroceryItemService,
      private groceryDialogService: GroceryDialogService
  ) { }

  async ngOnInit() {
    this.groceries = await this.groceryItemService.getAll();
  }

  async addGroceryItem() {
    const item: Grocery = await this.groceryDialogService.addGroceryItem();
    if (item) {
      this.displayToastMessage(`Grocery item '${item.name}' was added`, ToastClass.ADD_ITEM);
      await this._updateGroceries();
    }
  }

  async editGroceryItem(groceryItem: Grocery) {
    const item: Grocery = await this.groceryDialogService.editGroceryItem(groceryItem);
    if (item) {
      this.displayToastMessage(`Grocery item '${item.name}' was updated`, ToastClass.UPDATE_ITEM);
      await this._updateGroceries();
    }
  }

  async deleteGroceryItem(groceryItem: Grocery) {
    await this.groceryItemService.delete(groceryItem);
    this.displayToastMessage(`Grocery item '${groceryItem.name}' was removed`, ToastClass.REMOVE_ITEM);

    await this._updateGroceries();
  }

  addQuantityToGroceryItem(grocery: Grocery) {
    ++grocery.quantity;
    this.groceryItemService.update(grocery);
  }

  dropQuantityToGroceryItem(grocery: Grocery) {
    grocery.quantity = (grocery.quantity > 0) ? --grocery.quantity : grocery.quantity;
    this.groceryItemService.update(grocery);
  }

  private displayToastMessage(message: string, messageClass: ToastClass) {
    this.toastController.create({
      message,
      position: 'top',
      color: messageClass,
      duration: 3000
    }).then((ctrl) => ctrl.present());
  }

  private async _updateGroceries() {
    this.groceries = await this.groceryItemService.getAll();
  }
}
