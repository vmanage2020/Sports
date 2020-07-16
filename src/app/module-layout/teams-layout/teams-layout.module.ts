import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsLayoutRoutingModule } from './teams-layout-routing.module';
import { TeamCreateComponent } from './team-create/team-create.component';
import { TeamGridComponent } from './team-grid/team-grid.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamViewComponent } from './team-view/team-view.component';
import { TeamListComponent } from './team-list/team-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UIModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbTypeaheadModule, NgbPaginationModule, NgbDropdownModule, NgbDatepickerModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxMaskModule } from 'ngx-mask';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { TeamLayoutComponent } from './team-layout/team-layout.component';


@NgModule({
  declarations: [TeamCreateComponent, TeamGridComponent, TeamEditComponent, TeamViewComponent, TeamLayoutComponent, TeamListComponent],
  imports: [
    CommonModule,
    TeamsLayoutRoutingModule,
    ReactiveFormsModule,
    UIModule,
    SharedModule,
   HttpClientModule,
   FormsModule,
   ReactiveFormsModule,
   NgbPaginationModule,
   NgbTypeaheadModule,NgSelectModule,NgbDatepickerModule,
   FileUploadModule,NgbDropdownModule,
   Ng2SearchPipeModule,NgbAlertModule,
   NgxMaskModule.forRoot(),
  ],
  entryComponents:[TeamCreateComponent, TeamGridComponent, TeamEditComponent, TeamViewComponent]
})
export class TeamsLayoutModule { }
