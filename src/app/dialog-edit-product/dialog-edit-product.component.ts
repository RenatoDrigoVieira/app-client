import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrls: ['./dialog-edit-product.component.css']
})
export class DialogEditProductComponent implements OnInit {

  product: Product = {_id: '',name: '',department:'',price:0}

  constructor() { }

  ngOnInit() {
  }

}
