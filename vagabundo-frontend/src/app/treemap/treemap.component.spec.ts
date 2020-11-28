import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TreemapComponent } from './treemap.component';
import { ErrorMessageComponent } from '@error-message/error-message.component';

describe('TreemapComponent', () => {
  let component: TreemapComponent;
  let fixture: ComponentFixture<TreemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TreemapComponent,
        ErrorMessageComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreemapComponent);
    component = fixture.componentInstance;
  });

  it('should create a treemap element', () => {
    component.data = {
      'name': 'testMain',
      'children': [
        {
          'name': 'Test1',
          'value': 100
        }]
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create an empty treemap', () => {
    component.data = {
      'name': 'testMain',
      'children': []
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should contain an svg element', () => {
    component.data = {
      'name': 'testMain',
      'children': [
        {
          'name': 'Test2',
          'value': 10
        },
        {
          'name': 'Test3',
          'value': 140
        }
      ]
    };
    fixture.detectChanges();

    const tremapElement: HTMLElement = fixture.nativeElement;
    const svg = tremapElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  // TODO disable for now, does not work as expected
  xit('should contain four boxes when four data elements are passed in', () => {
    component.data = {
      'name': 'testMain',
      'children': [
        {
          'name': 'Test2',
          'value': 10
        },
        {
          'name': 'Test3',
          'value': 140
        },
        {
          'name': 'Test1',
          'value': 1
        },
        {
          'name': 'Test4',
          'value': 140
        }
      ]
    };
    fixture.detectChanges();

    const treemapElement: HTMLElement = fixture.nativeElement;
    const g = treemapElement.querySelector('svg g');
    expect(g.children.length).toBe(4 + 1); // four boxes and the sum box extra
  });
});
