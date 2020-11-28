import { AppPage } from './app.po';

describe('Vagabundo App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  xit('should display header message', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Vagabundo');
  });
});
