import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import Grocery from '@models/grocery';

@Component({
  selector: 'grocery-item-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class GroceryItemModal implements OnInit {
  @Input() header: string = 'Add Grocery Item';
  @Input() currentGroceries: Array<Grocery> = [];
  @Input() editableGrocery: Grocery = null;

  formErrors: Boolean;
  addGroceryForm: FormGroup;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.formErrors = false;
    this.addGroceryForm = new FormGroup({
      name: new FormControl(
        {
          value: (this.editableGrocery && this.editableGrocery.name) ? this.editableGrocery.name : '',
          disabled: !!(this.editableGrocery && this.editableGrocery.name)
        },
        [Validators.required, Validators.minLength(3), this.noCurrentGroceryValidator.bind(this)]
      ),
      quantity: new FormControl(
        (this.editableGrocery && this.editableGrocery.quantity) ? this.editableGrocery.quantity : 0,
        [Validators.required, Validators.min(0)]
      ),
      price: new FormControl(
        (this.editableGrocery && this.editableGrocery.pricePerUnit) ? this.editableGrocery.pricePerUnit : 0,
        [Validators.pattern(/^(\d{1,3}(\d*))(\.\d{1,2})?$/)]
      )
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  submitNewGrocery() {
    if (this.addGroceryForm.valid) {
      this.addGroceryForm.enable();
      const { name, quantity, price } = this.addGroceryForm.value;
      this.modalCtrl.dismiss(
        new Grocery(name, quantity, price)
      );
    } else {
      this.formErrors = true;
    }
  }

  private noCurrentGroceryValidator(control: AbstractControl): { [key: string]: boolean } {
    return this.currentGroceries
      .map(listItem => listItem.name.toLowerCase())
      .includes(control.value !== undefined && control.value.toLowerCase()) ? { 'uniqueGrocery': true } : null;
  }
}
