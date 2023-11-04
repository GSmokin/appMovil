import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor( public auth:AngularFireAuth) { }
  
  login(mail: string, password: string){
    return this.auth.createUserWithEmailAndPassword(mail, password)
  }

  logout(){
    return this.auth.signOut();
  }

  registrar(mail: string, password: string){
    return this.auth.createUserWithEmailAndPassword(mail, password);
  }

  async getUid(){
    const user =  await this.auth.currentUser;
    if (user === undefined){
      return null; 
    } else{
      return user?.uid
    }
  }

}
