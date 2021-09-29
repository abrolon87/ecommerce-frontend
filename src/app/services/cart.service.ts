import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalItems: Subject<number> = new BehaviorSubject<number>(0);

  // sessionStorage data does not persist after a tab has been closed
  storage: Storage = sessionStorage; // given to us for free
  // localStorage data persists after closing a tab and survives browser restarts
  // storage: Storage = localStorage; // given to us for free
  constructor() {

    // read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;
      //calculate totals based on data in storage
      this.calculateCartTotal();
    }
  }

  addToCart(newItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;
    // check if item already in cart
    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find((item) => item.id === newItem.id)!;
      // for (let item of this.cartItems) {
      //   if (item.id === newItem.id) {
      //     existingCartItem = item;
      //     break;
      //   }
      // }

      // check if found in cart
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      // increment quantity
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(newItem);
    }

    this.calculateCartTotal();
  }

  calculateCartTotal() {
    let totalPriceValue: number = 0;
    let totalItemsValue: number = 0;

    for (let item of this.cartItems) {
      totalPriceValue += item.quantity * item.unitPrice;
      totalItemsValue += item.quantity;
    }

    // publish new values... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalItems.next(totalItemsValue);

    // log cart data for debugging
    this.logCartData(totalPriceValue, totalItemsValue);

    // persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); // storage item is key: value pair of strings
  }

  logCartData(totalPriceValue: number, totalItemsValue: number) {
    console.log('Items in Cart: ');
    for (let item of this.cartItems) {
      const subTotalPrice = item.quantity * item.unitPrice;
      console.log(
        `name: ${item.name} - quantity=${item.quantity} - unitPrice=${item.unitPrice} - subTotalPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice: ${totalPriceValue.toFixed(2)}, totalItems: ${
        this.totalItems
      }`
    );
    console.log('-----');
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.removeItemFromCart(cartItem);
    } else {
      this.calculateCartTotal();
    }
  }

  removeItemFromCart(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      (item) => item.id === cartItem.id
    );
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.calculateCartTotal();
    }
  }
}
