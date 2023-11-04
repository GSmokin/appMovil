import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent  implements OnInit {

  cliente: Cliente ={
    uid: '',
    nombre: '',
    email: '',
    edad: null,  
    celular: '',
    foto: '',
  } 

  newFile: any;

  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestorageService : FirestorageService,
              public firestoreService: FirestoreService) { }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log(uid);
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal')
  }

  async newImageUpload(event: any){
    console.log(event);
   if (event.target.files && event.target.files[0]){
     this.newFile = event.target.files[0];
     const reader = new FileReader();
     reader.onload = ((image) => {
       this.cliente.foto = image.target?.result as string;
     });
     reader.readAsDataURL(event.target.files[0]);
   }
 }

  async registrar(){
    const credenciales = {
      mail: this.cliente.email,
      password: this.cliente.celular,
    };
    const res = await this.firebaseauthService.registrar(credenciales.mail, credenciales.password).catch( err=>{
      console.log('error',err);
    });
    const uid = await this.firebaseauthService.getUid();
    if (uid !== null && uid !== undefined) {
      this.cliente.uid = uid; // Asignar uid solo si no es null ni undefined
      console.log(uid);
    } else {
      // Manejar el caso en que uid sea null o undefined
      console.log('uid es null o undefined');
    }
    this.guardarUser();
    
 }

 async guardarUser(){
  const path = 'Clientes';
  const name = this.cliente.nombre;
  if(this.newFile !== undefined){
    const res = await this.firestorageService.uploadImage(this.newFile,path,name);
    this.cliente.foto = res;
  }
  
  this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then( res =>{
    console.log('guardado')
    
  }).catch( error =>{
    
  });
}

 salir(){
  this.firebaseauthService.logout;
 }



}
