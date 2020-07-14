import { Component, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { CookieService } from 'src/app/core/services/cookie.service';
import { apiURL, Constant } from 'src/app/core/services/config';
import { AngularFireStorage } from '@angular/fire/storage';
import { SharedService } from 'src/app/shared/shared.service';
import { NgiNotificationService } from 'ngi-notification';

import * as moment from 'moment';

  @Component({
    selector: 'app-import-user-list-edit',
    templateUrl: './import-user-list-edit.component.html',
    styleUrls: ['./import-user-list-edit.component.scss']
  })
  export class ImportUserListEditComponent implements OnInit {
  
    resourceID = this.route.snapshot.paramMap.get('resourceId'); 
  
    viewUserListType: any;
  
    db: any = firebase.firestore();
    value: any = [];
    getAllplayerlist: any = [];
    getAllPlayerlistData: any = [];
  
    data: any;     
    uid: any;
    orgId: any;

    getUserData: any;
  
    gender: any = [
      { name: 'Male' },
      { name: 'Female' }
    ];
    
    stateList: any; 
    countryCodeList: any = [
      { name: 'United State', country_code:'US' },
      { name: 'Canada', country_code:'CA' }
    ];
    
  loading = true;
  displayLoader: any = true;

  submitted = false;
  createImportUserForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,public cookieService: CookieService, private notification: NgiNotificationService) { 
    this.createForm();
  }
  
    
  createForm() {
    this.createImportUserForm = this.formBuilder.group({
      id: [''],
      player_first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      player_last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      player_initial: [''],
      player_gender: [null],
      player_DOB: ['', [Validators.required]],
      level_of_play: [''],
      level_id: [''],
      guardian1_first_name: [''],
      guardian1_last_name: [''],
      guardian1_email_address: [''],
      guardian2_first_name: [''],
      guardian2_last_name: [''],
      guardian2_email_address: [''],
      status: [''],
      processed_flag: [''],
      error_description: [''],
      address: [''],
      city: [''],
      state: [null],
      country: [null],
      postal_code: ['']
    });

    /*
    this.createImportUserForm = this.formBuilder.group({
      user_id: [''],
      imported_file_id: [''],
      organization_id: [''],
      imported_log_data_id: [''],
      intelimObj: this.formBuilder.group({
        id: [''],
        player_first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        player_last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        player_initial: [''],
        player_gender: [null],
        player_DOB: ['', [Validators.required]],
        level_of_play: [''],
        level_id: [''],
        guardian1_first_name: [''],
        guardian1_last_name: [''],
        guardian1_email_address: [''],
        guardian2_first_name: [''],
        guardian2_last_name: [''],
        guardian2_email_address: [''],
        status: [''],
        processed_flag: [''],
        error_description: [''],
        address: [''],
        city: [''],
        state: [null],
        country: [null],
        postal_code: ['']
      })
    });
    */
  }

    ngOnInit() {
      this.loading = true;
      this.displayLoader = true;
          
      this.viewUserListType = localStorage.getItem('viewUserListType');
  
      this.uid = this.cookieService.getCookie('uid');
      this.orgId = localStorage.getItem('org_id');
      this.getUserList();  
    }
  
    async getUserList(){
   
      this.viewUserListType = localStorage.getItem('resourceID');

      this.getAllplayerlist = await this.db.collection('/organization').doc(this.orgId).collection('/import_users_log').doc(this.viewUserListType).collection('/imported_users_data').where('id', '==', this.resourceID).get();

  
      this.getAllPlayerlistData = await this.getAllplayerlist.docs.map((doc: any) => doc.data());
   
      this.getUserData = this.getAllPlayerlistData[0];
      this.getUserData.athlete_1_dob_value = this.getUserData.athlete_1_dob.toDate();

      if (typeof (this.getUserData.athlete_1_dob) !== "string") {
        this.getUserData.athlete_1_dob_value = moment(this.getUserData.athlete_1_dob.toDate()).format('MM-DD-YYYY').toString();
      } else {
        this.getUserData.athlete_1_dob_value = moment(this.getUserData.athlete_1_dob.toDate()).format('MM-DD-YYYY').toString();
      }
      console.log(this.getUserData.athlete_1_dob_value);
      console.log(this.getUserData);

      this.loading = false;
      this.displayLoader = false; 

    }

    
   
  get f() { return this.createImportUserForm.controls; }

  async onSubmit(form) {

    console.log(form);

  }
  
    listUser(){
      this.router.navigate(['/useruploads/list']);
    }
  
    addUser(){
      this.router.navigate(['/useruploads/createlist']);
    }
    
    viewUser(resourceId: string){
      this.router.navigate(['/useruploads/viewlist/'+resourceId]);
    }
    
    editUser(resourceId: string){
      this.router.navigate(['/useruploads/editlist/'+resourceId]);
    }
  
    refreshPage() {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/useruploads/list']);
    }
   
    injectedData: any;
    
    editUserRecord(data) {
     this.router.navigate(['/useruploads/editlist/'+data]);
    }
  
  }
  
  