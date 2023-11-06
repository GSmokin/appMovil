import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent  implements OnInit {

  productos: Producto[] = [];

  newProducto!: Producto;

  enableNewProducto = false;

  private path = 'Productos/';

  loading: any;

  newImage = '';

  newFile = '';

  constructor(public menucontroler:MenuController, 
              public firestoreService:FirestoreService,
              public loadingCtrl: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService ) { }

  ngOnInit() {
    this.getProductos();
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal')
  }

  async guardarProducto(){
    this.showLoading();
    const path = 'Productos';
    const name = this.newProducto.nombre;
    if(this.newFile !== undefined){
      const res = await this.firestorageService.uploadImage(this.newFile,path,name);
      this.newProducto.foto = res;
    }
    
    this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then( res =>{
      this.loading.dismiss();
      this.presentToast('Se a Guardado Exitosamente')
    }).catch( error =>{
      this.presentToast('No se pudo Guardar')
    });
  }

  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res=> {
      this.productos = res;
    });
  }
  
  async deleteProducto(producto: Producto){
      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'Alerta',
        subHeader: 'Cuidado!',
        message: 'Estas seguro de esta accion',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Alert canceled');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              console.log('Alert confirmed');

              //Funcion Eliminar
              this.firestoreService.deleteDoc(this.path, producto.id).then( res =>{
                this.loading.dismiss();
                this.presentToast('Eliminado Exitosamente')
                this.alertController.dismiss();
              }).catch( error =>{
                this.presentToast('No se pudo Eliminar')
              });
            },
          },
        ],
      }); 
      await alert.present();

  }

  nuevo(){
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      precioNormal: null,
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
    
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });

    this.loading.present();
  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'light'
    });

    await toast.present();
  }

  async newImageUpload(event: any){
     console.log(event);
    if (event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) => {
        this.newProducto.foto = image.target?.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
