import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor( public menucontroler: MenuController) { }

  ngOnInit() {}

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal')
  }
}
