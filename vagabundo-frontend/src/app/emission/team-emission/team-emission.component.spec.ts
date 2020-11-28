import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { JwtModule } from '@auth0/angular-jwt';

import { metaReducers, reducers } from '@app/store/reducers';
import { TeamEmissionComponent } from './team-emission.component';
import { TreemapComponent } from '@treemap/treemap.component';
import { ErrorMessageComponent } from '@error-message/error-message.component';

describe('TeamEmissionComponent', () => {
  let component: TeamEmissionComponent;
  let fixture: ComponentFixture<TeamEmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamEmissionComponent,
        TreemapComponent,
        ErrorMessageComponent
      ],
      imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return null;
            }
          }
        }),
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEmissionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
