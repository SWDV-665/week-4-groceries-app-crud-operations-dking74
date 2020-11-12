import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import Grocery from '@models/grocery';
import { GroceryItemModal } from '@pages/grocery/modal/modal.component';
import { GroceryItemService } from '@services/grocery-item-service/grocery-item.service';

interface ModalControllerProps {
  currentGroceries: Array<Grocery>;
  editableGrocery?: Grocery;
  header?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroceryDialogService {

  constructor(
    private groceryItemService: GroceryItemService,
    private modalController: ModalController
  ) { }

  async addGroceryItem(): Promise<Grocery> {
    return this._displayModal(
      {
        currentGroceries: await this.groceryItemService.getAll()
      }
    ).then((modal: HTMLIonModalElement) => 
      modal.onDidDismiss().then(async groceryItem => {
        const item: Grocery = groceryItem.data;
        if (item) {
          await this.groceryItemService.create(item);
        }

        return item;
      })
    );
  }

  async editGroceryItem(groceryItem: Grocery): Promise<Grocery> {
    return this._displayModal(
      {
        header: 'Edit Grocery Item',
        currentGroceries: await this.groceryItemService.getAll(),
        editableGrocery: groceryItem
      }
    ).then((modal: HTMLIonModalElement) => 
      modal.onDidDismiss().then(async groceryItem => {
        const item: Grocery = groceryItem.data;
        if (item) {
          await this.groceryItemService.update(item);
        }
        
        return item;
      })
    );
  }

  private async _displayModal(componentProps: ModalControllerProps) {
    return this.modalController.create({
        component: GroceryItemModal,
        cssClass: 'grocery-item-modal',
        componentProps: componentProps
      }).then(async modal => {
        await modal.present();

        return modal;
      });
  }
}
