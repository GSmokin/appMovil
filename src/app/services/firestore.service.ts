import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database:AngularFirestore) { }

  createDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).set(data)
  }

  getDoc<tipo>(path: string, id: string): Observable<tipo> {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges().pipe(
      filter((res: tipo | undefined) => res !== undefined), // Filtra para asegurarte de que res no sea undefined
      map((res: tipo | undefined) => res as tipo) // Asegura que res sea de tipo tipo
    );
  }
  
  deleteDoc(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).delete()
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).update(data)
  }
  
  getId(){
    return this.database.createId();
  }
 
  getCollection<tipo>(path:string){
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }
}
