import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmissionComponent } from '@emission/emission.component';
import { LoginComponent } from '@login/login.component';

import { AuthGuardService } from '@authguardservice/auth-guard.service';
import { FaqComponent } from '@faq/faq.component';
import { StartComponent } from '@app/start/start.component';
import { TeamEmissionComponent } from '@team-emission/team-emission.component';
import { CompanyEmissionComponent } from '@company-emission/company-emission.component';
import { MyEmissionComponent } from '@my-emission/my-emission.component';
import { LogoutComponent } from '@app/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'emission',
    pathMatch: 'full'
  },
  {
    path: 'emission',
    component: EmissionComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: MyEmissionComponent
      },
      {
        path: 'team',
        component: TeamEmissionComponent
      },
      {
        path: 'company',
        component: CompanyEmissionComponent
      }
    ]
  },
  {
    path: 'faq',
    component: FaqComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'start',
    component: EmissionComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: '**',
    redirectTo: 'my'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
