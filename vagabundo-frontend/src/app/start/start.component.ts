import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injector, ViewEncapsulation
} from '@angular/core';
import { environment } from '@environments/environment';
import { IntroductionComponent } from '@app/introduction/introduction.component';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * A start component shown when the user is not logged in. From
 * here the user can proceed to the Azure login page.
 *
 * It also enables the user to show the introduction.
 */
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  /** Azure login URL. */
  loginUrl = environment.LOGIN_URL;
  /** Introduction modal. */
  introduction: IntroductionComponent;

  faQuestionCircle: IconDefinition = faQuestionCircle;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  /**
   * Opens the introduction modal.
   */
  public startIntro(): void {
    if (this.introduction === undefined) {
      this.loadIntroduction();
    }
    this.introduction.open();
  }

  /**
   * Attaches the introduction component to the HTML.
   */
  private loadIntroduction(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(IntroductionComponent);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.introduction = componentRef.instance;
  }
}
