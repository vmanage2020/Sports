import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { CookieService } from 'src/app/core/services/cookie.service';


import { NgiNotificationService } from 'ngi-notification';


@Component({
  selector: 'app-canned-response-list-edit',
  templateUrl: './canned-response-list-edit.component.html',
  styleUrls: ['./canned-response-list-edit.component.scss']
})
export class CannedResponseListEditComponent implements OnInit {

  resourceID = this.route.snapshot.paramMap.get('resourceId'); 
  
    db: any = firebase.firestore();
    value: any = [];
  
   
    getCannedResponseValue: any = [];
    getCannedResponseValueData: any = [];
    getCannedResponseValueArray: any = [];
  
    
    getSports: any = [];
    getSportsData: any = [];
    getSportsArray: any = [];
  
    
    getTag: any = [];
    getTagData: any = [];
    getTagArray: any = [];
  
  
    country: any = [];
    countryCodeSelect: any = [];
    
    data: any;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
  
    uid: any;
    orgId: any;
    orgName: any;
    orgAbbrev: any;
    
    loading = true;
    displayLoader: any = true;
  
    submitted = false;
    createcannedresponseForm: FormGroup;
  
    constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,public cookieService: CookieService, private notification: NgiNotificationService) { 
       this.createForm(); 
    }
    
    createForm() {
      this.createcannedresponseForm = this.formBuilder.group({
          canned_response_title: ['', Validators.required ],
          canned_response_description: ['', Validators.required ],
          sport_id: ['', Validators.required ],
          sport_name: [''],
          organization_id: [''],
          organization_name: [''],
          organization_abbreviation: [''],
      });
    }
    
  
    ngOnInit() {
      this.uid = this.cookieService.getCookie('uid');
      this.orgId = localStorage.getItem('org_id');
      this.getCannedResponseInfo();
      this.getAllSports();
      this.loading = false;
      this.displayLoader = false;
    }

    async getCannedResponseInfo(){   
       
      this.getCannedResponseValue = await this.db.collection('CannedResponse').doc(this.resourceID).get();
      if (this.getCannedResponseValue.exists) {
        this.getCannedResponseValueData = await this.getCannedResponseValue.data();
      } else {
        this.getCannedResponseValueData = [];
      }
    
      this.getCannedResponseValueArray = this.getCannedResponseValueData; 
      console.log(this.getCannedResponseValueArray);

      //this.getAllPositionBySport(this.getPositionValueData.sport_id, this.uid)
    
      this.loading = false;
      this.displayLoader = false; 
        
    }

   

    async getAllSports(){    
      
      //this.getSports = await this.db.collection('sports').orderBy('sport_id').get();
      this.getSports = await this.db.collection('/organization').doc(this.orgId).collection('/sports').orderBy('sport_id').get();
      this.getSportsData = await this.getSports.docs.map((doc: any) => doc.data());
      this.getSportsArray = this.getSportsData; 
      console.log(this.getSportsArray);
  
    }
  
     
    get f() { return this.createcannedresponseForm.controls; }
  
    async onSubmit(form) {
      try {
        this.submitted = true;
        if (form.invalid) {
          return;
        }
        
      this.displayLoader = true;
      this.loading = true;
        
  
      this.uid = this.cookieService.getCookie('uid');
      this.orgId = localStorage.getItem('org_id');
      this.orgName = localStorage.getItem('org_name');
      this.orgAbbrev = localStorage.getItem('org_abbrev');
    
      
      for(let sports of this.getSportsArray){
        if(form.value.sport_id==sports.sport_id)
          {
            form.value.sport_name = sports.name;
          }      
      }
    
      let insertObj = {
        "canned_response_title": form.value.canned_response_title,
        "cannedResponseTitle": form.value.canned_response_title,
        "canned_response_description": form.value.canned_response_description,
        "cannedResponseDesc": form.value.canned_response_description,
        "sport_id": form.value.sport_id,
        "sport_name": form.value.sport_name,
        "is_active": true,
        "is_deleted": false,
        "organization_id": this.orgId,
        "organization_name": this.orgName,
        "organization_abbreviation": this.orgAbbrev,
        "created_datetime": new Date(),
        "created_uid": this.uid,
        "updated_datetime": new Date(),
        "updated_uid": "",
        "sort_order": 0,
      }
         
      
        await this.db.collection('CannedResponse').doc(this.resourceID).update(insertObj);

        
        this.router.navigate(['/cannedresponse/list']);
  
        this.notification.isNotification(true, "Canned Response Data", "Canned Response has been updated successfully.", "check-square");
        
      } catch (error) {
        
        console.log(error);
         
      }
    }
  
    
  
    listCannedResponses(){
      this.router.navigate(['/cannedresponse/list']);
    }
  
    addCannedResponses(){
      this.router.navigate(['/cannedresponse/createlist']);
    }
    
    viewCannedResponses(resourceId: string){
      this.router.navigate(['/cannedresponse/viewlist/'+resourceId]);
    }
    
    editCannedResponses(resourceId: string){
      this.router.navigate(['/cannedresponse/editlist/'+resourceId]);
    }
  
    async deleteCannedResponses(resourceId: string, resourceName: string){
      
      try {
        this.notification.isConfirmation('', '', 'CannedResponse Data', ' Are you sure to delete ' + resourceName + ' ?', 'question-circle', 'Yes', 'No', 'custom-ngi-confirmation-wrapper').then(async (dataIndex) => {
          if (dataIndex[0]) {
            console.log("yes");
            await this.db.collection('CannedResponse').doc(resourceId).delete();
            this.notification.isNotification(true, "CannedResponse Data", "CannedResponse Data has been deleted successfully.", "check-square");
            this.refreshPage();
          } else {
            console.log("no");
          }
        }, (err) => {
          console.log(err);
        })
      } catch (error) {
        console.log(error);
        this.notification.isNotification(true, "CannedResponse Data", "Unable to delete.Please try again later.", "times-circle");
      }
    }
   
   refreshPage() {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/cannedresponse/list']);
  }

}



