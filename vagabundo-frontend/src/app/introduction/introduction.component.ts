import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

import { faChartBar, faSuitcaseRolling, faTree } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export const INTRODUCTION_COOKIE_NAME = 'vagabundoIntroduction';

/**
 * Shows a modal one time in this browser with an introduction to the application. When shown a cookie is
 * stored so it is not shown again.
 */
@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent {
  @ViewChild('content') public templateref: TemplateRef<any>;

  modal: NgbModalRef;

  /** Icons. */
  faSuitcaseRolling: IconDefinition = faSuitcaseRolling;
  faTree: IconDefinition = faTree;
  faChartBar: IconDefinition = faChartBar;

  constructor(
    private modalService: NgbModal,
    private cookie: CookieService
  ) {}

  /**
   * Opens the introduction modal and stores a cookie so it is not opened again.
   */
  public open(): void {
    this.modal = this.modalService.open(this.templateref, {
      centered: true,
      size: 'lg'
    });
    this.cookie.set(INTRODUCTION_COOKIE_NAME, 'set');
  }
}
