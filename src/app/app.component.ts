import { Component } from '@angular/core';
import { ProductsService } from './products.service';
import { Observer, Observable } from 'rxjs';
import { Product } from './product.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  simpleReqProductsObs$: Observable<Product[]>
  productsErrorHandling: Product[]
  productsLoading: Product[];
  bLoading: boolean = false;
  productsId: Product[]
  newlyProducts: Product[] = []
  productsToDelete: Product[]=[]



  constructor(private productsService: ProductsService,
    private snackBar:MatSnackBar){}

  ngOnInit(){
  }
  
  getSimpleHttpRequest(){
    this.simpleReqProductsObs$ =this.productsService.getProducts()
  }

  getProductsWithErrorHandling(){
    this.productsService.getProductsError()
    .subscribe((prods)=>{
          this.productsErrorHandling = prods
    },
    (err)=>{
      console.log(err)
      console.log("Message " + err.error.msg)
      console.log("Status code" + err.status)
      let config = new MatSnackBarConfig
      config.duration = 2000
      config.panelClass=['snack_error']

      if(err.status===0){
        this.snackBar.open('Could not connect to the server','',config)
      }else{
        this.snackBar.open(err.error.msg,'',config)
      }
    }) 
  }
  getProductsWithErrorHandlingOk(){
    this.productsService.getProductsDelay()
    .subscribe((prods)=>{
      this.productsErrorHandling = prods
      let config = new MatSnackBarConfig
      config.duration = 2000
      config.panelClass=['snack_ok']
      this.snackBar.open('Products successfuly loaded','',config)

    },
    (err)=>{
      console.log(err)
    }) 
  }
  getProductsLoading(){
    this.bLoading = true;
    this.productsService.getProductsDelay()
    .subscribe((prods)=>{
      this.productsLoading = prods
      this.bLoading = true;

    },
    (err)=>{
      console.log(err)
      this.bLoading = false;
    }) 

  }
  getProductsIds(){
    this.productsService.getProductsIds()
    .subscribe((ids)=>{
      this.productsId = ids.map(id=>  ({_id: id, name:'',department:'',price:0}))
    })
  }

  loadName(id: string){
    this.productsService.getProductName(id)
    .subscribe(name=>{
     let index =  this.productsId.findIndex(p=>p._id===id)
     if(index>=0){
       this.productsId[index].name=name;
     }
    })
  }
  saveProduct(name:string,department: string, price:number ){
    let p= {name,department,price}
    this.productsService.saveProduct(p)
    .subscribe(
      (p: Product)=>{
        this.newlyProducts.push(p)
      },
      (err)=>{
        console.log(err)
        let config = new MatSnackBarConfig
        config.duration = 2000
        config.panelClass=['snack_error']
  
        if(err.status===0){
          this.snackBar.open('Could not connect to the server','',config)
        }else{
          this.snackBar.open(err.error.msg,'',config)
        }
      }
    )
  }
  loadProductsToDelete(){
    this.productsService.getProducts()
    .subscribe((prods)=>this.productsToDelete=prods)
  }
  deleteProduct(p:Product){
    this.productsService.deleteProduct(p)
    .subscribe((res)=>{
      let i = this.productsToDelete.findIndex(prod=>p._id==prod._id)
      if(i>=0){
        this.productsToDelete.splice(i,1)
      }
    },
    (err)=>{
      console.log(err)
    }
    )
  }
}
