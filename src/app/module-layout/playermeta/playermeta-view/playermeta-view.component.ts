import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-playermeta-view',
  templateUrl: './playermeta-view.component.html',
  styleUrls: ['./playermeta-view.component.scss']
})
export class PlayermetaViewComponent implements OnInit {

  db: any = firebase.firestore();
  value: any = [];
  getAllplayermeta: any = [];
  getAllPlayermetaData: any = [];

  data: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  resourceID = this.route.snapshot.paramMap.get('resourceId'); 

  loading = true;
  displayLoader: any = true;
  
  constructor(private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit() { 
    this.getPlayerMeta();  
  }

  async getPlayerMeta(){
    this.getAllplayermeta = await this.db.collection('playermetadata').doc(this.resourceID).get();
    if (this.getAllplayermeta.exists) {
      this.getAllPlayermetaData = this.getAllplayermeta.data();
    } else {
      this.getAllPlayermetaData = [];
    }
    
    this.loading = false;
    this.displayLoader = false; 
  }


  listPlayermeta(){
    this.router.navigate(['/playermeta']);
  }

  addPlayermeta(){
    this.router.navigate(['/playermeta/create']);
  }
  
  viewPlayermeta(resourceId: string){
    this.router.navigate(['/playermeta/view/'+resourceId]);
  }
  
  editPlayermeta(resourceId: string){
    this.router.navigate(['/playermeta/edit/'+resourceId]);
  }

  deletePlayermeta(resourceId: string){
    this.router.navigate(['/playermeta/delete/'+resourceId]);
  }

}
