import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DomainComponentsPage, DomainDeleteDialog, DomainUpdatePage } from './domain.page-object';

const expect = chai.expect;

describe('Domain e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let domainComponentsPage: DomainComponentsPage;
  let domainUpdatePage: DomainUpdatePage;
  let domainDeleteDialog: DomainDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Domains', async () => {
    await navBarPage.goToEntity('domain');
    domainComponentsPage = new DomainComponentsPage();
    await browser.wait(ec.visibilityOf(domainComponentsPage.title), 5000);
    expect(await domainComponentsPage.getTitle()).to.eq('nHipsterApp.domain.home.title');
    await browser.wait(ec.or(ec.visibilityOf(domainComponentsPage.entities), ec.visibilityOf(domainComponentsPage.noResult)), 1000);
  });

  it('should load create Domain page', async () => {
    await domainComponentsPage.clickOnCreateButton();
    domainUpdatePage = new DomainUpdatePage();
    expect(await domainUpdatePage.getPageTitle()).to.eq('nHipsterApp.domain.home.createOrEditLabel');
    await domainUpdatePage.cancel();
  });

  it('should create and save Domains', async () => {
    const nbButtonsBeforeCreate = await domainComponentsPage.countDeleteButtons();

    await domainComponentsPage.clickOnCreateButton();

    await promise.all([domainUpdatePage.setNameInput('name')]);

    expect(await domainUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await domainUpdatePage.save();
    expect(await domainUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await domainComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Domain', async () => {
    const nbButtonsBeforeDelete = await domainComponentsPage.countDeleteButtons();
    await domainComponentsPage.clickOnLastDeleteButton();

    domainDeleteDialog = new DomainDeleteDialog();
    expect(await domainDeleteDialog.getDialogTitle()).to.eq('nHipsterApp.domain.delete.question');
    await domainDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(domainComponentsPage.title), 5000);

    expect(await domainComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
