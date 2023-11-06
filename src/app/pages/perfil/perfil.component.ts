import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
  }; 

  uid = '';

  newFile: any;

  suscriberUserInfo!: Subscription;

  ingresarEnable = false;

  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestorageService : FirestorageService,
              public firestoreService: FirestoreService) {

                this.firebaseauthService.stateAuth().subscribe(res =>{
                  console.log(res);
                  if(res !== null){
                    this.uid = res.uid;
                    this.getUserInfo(this.uid);
                  } else {
                    this.initCliente();
                  }
                })
               }

  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log(uid);
  }

  initCliente(){
    this.uid = '';
    this.cliente = {
      uid: '',
     nombre: '',
      email: '',
      edad: null,  
      celular: '',
      foto: '',
   }; 
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
  this.suscriberUserInfo.unsubscribe();
 }

 getUserInfo(uid: string){
    const path = 'Clientes';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res =>{
        this.cliente = res;
    });
 }

 ingresar(){
  const credenciales = {
    mail: this.cliente.email,
    password: this.cliente.celular,
  };
  this.firebaseauthService.login(credenciales.mail, credenciales.password).then(res =>{
    console.log('ingresado')
  })
 }

}
