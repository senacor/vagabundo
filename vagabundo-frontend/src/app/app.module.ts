import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule, Provider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { registerLocaleData } from '@angular/common';

import localeDe from '@angular/common/locales/de';

import { FormsModule } from '@angular/forms';

import { NgbDatepickerConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '@environments/environment';
import { DatepickerConfigService } from '@config/datepicker-config.service';

import { AppRoutingModule } from './app-routing.module';
import { ApiModule } from '@api/api.module';
import { ApiConfiguration } from '@api/api-configuration';

import { AppComponent } from './app.component';
import { HeaderComponent } from '@header/header.component';
import { EmissionComponent } from '@emission/emission.component';
import { EmissionOverviewComponent } from '@emission-overview/emission-overview.component';
import { EmissionDistanceChartComponent } from '@emission-distance-chart/emission-distance-chart.component';
import { TreemapComponent } from '@treemap/treemap.component';
import { DatepickerComponent } from '@datepicker/datepicker.component';

import { reducers, metaReducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { TripEffects } from '@store/effects/trip.effects';
import { StatEffects } from '@store/effects/stat.effects';
import { TeamStatEffects } from '@store/effects/team-stat.effects';
import { DateEffects } from '@store/effects/date.effects';
import { TravellerEffects } from '@store/effects/traveller.effects';

import { LoginComponent } from '@login/login.component';
import { tokenGetter } from '@authservice/authentication.service';
import { FaqComponent } from '@faq/faq.component';
import { IntroductionComponent } from '@introduction/introduction.component';
import { StartComponent } from '@start/start.component';
import { SidebarComponent } from '@sidebar/sidebar.component';
import { MyEmissionComponent } from '@my-emission/my-emission.component';
import { TeamEmissionComponent } from '@team-emission/team-emission.component';
import { CompanyEmissionComponent } from '@company-emission/company-emission.component';
import { LoadingComponent } from '@loading/loading.component';
import { ErrorMessageComponent } from '@error-message/error-message.component';
import { LogoutComponent } from './logout/logout.component';
import {ComparisonTileComponent} from '@emission/comparison-tile/comparison-tile.component';

registerLocaleData(localeDe);

export function initApiConfiguration(config: ApiConfiguration): Function {
  return () => {
    config.rootUrl = environment.API_BASE_URL;
  };
}

export const INIT_API_CONFIGURATION: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initApiConfiguration,
  deps: [ApiConfiguration],
  multi: true
};

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        EmissionComponent,
        EmissionOverviewComponent,
        EmissionDistanceChartComponent,
        TreemapComponent,
        DatepickerComponent,
        LoginComponent,
        IntroductionComponent,
        FaqComponent,
        StartComponent,
        MyEmissionComponent,
        TeamEmissionComponent,
        CompanyEmissionComponent,
        LoadingComponent,
        LogoutComponent,
        ErrorMessageComponent,
        ComparisonTileComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
        ApiModule,
        FontAwesomeModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: [environment.API_BASE_PATH]
            }
        }),
        StoreModule.forRoot(reducers, { metaReducers }),
        environment.production ? [] : StoreDevtoolsModule.instrument(),
        EffectsModule.forRoot([TripEffects, StatEffects, TeamStatEffects, DateEffects, TravellerEffects])
    ],
    providers: [
        INIT_API_CONFIGURATION,
        { provide: NgbDatepickerConfig, useClass: DatepickerConfigService },
        { provide: LOCALE_ID, useValue: 'de' },
        { provide: 'Window', useValue: window },
        CookieService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {  }
