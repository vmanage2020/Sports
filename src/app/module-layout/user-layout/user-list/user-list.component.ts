import { Component, OnInit, Inject } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';

import { Router } from '@angular/router';

import { NgiNotificationService } from 'ngi-notification';

import { DOCUMENT } from '@angular/common';

import { CookieService } from 'src/app/core/services/cookie.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  db: any = firebase.firestore();
  value: any = [];
  getAllplayerlist: any = [];
  getAllPlayerlistData: any = [];

  data: any;
  datax: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  loading = true;
  displayLoader: any = true;

  uid: any;
  orgId: any;

  constructor(private router: Router,private notification: NgiNotificationService, @Inject(DOCUMENT) private _document: Document,public cookieService: CookieService) { }

  ngOnInit() {
    this.uid = this.cookieService.getCookie('uid');
    this.orgId = localStorage.getItem('org_id');
    this.getUserList();  
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    }; 
  }

  async getUserList(){

    //this.getAllplayerlist = await this.db.collection('users').orderBy('sport_id').get();
    if(this.orgId=='') {
      this.getAllplayerlist = await this.db.collection('users').get();
    } else {
      console.log("orgId"+this.orgId);
      
      //this.getAllplayerlist = await this.db.collection('users').where('organization_id', '==', this.orgId).get();

      this.getAllplayerlist = await this.db.collection('/organization').doc(this.orgId).collection('/users')
                            .where('isUserDuplicated', '==', false).get();
    }
    
    this.getAllPlayerlistData = await this.getAllplayerlist.docs.map((doc: any) => doc.data());
    console.log(this.getAllPlayerlistData);
    this.data = this.getAllPlayerlistData;
    this.dtTrigger.next();
    this.loading = false;
    this.displayLoader = false; 
 
  }

  listUser(){
    this.router.navigate(['/users/list']);
  }

  addUser(){
    this.router.navigate(['/users/createlist']);
  }
  
  viewUser(resourceId: string){
    this.router.navigate(['/users/viewlist/'+resourceId]);
  }
  
  editUser(resourceId: string){
    this.router.navigate(['/users/editlist/'+resourceId]);
  }

  refreshPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/users/list']);
  }

}
