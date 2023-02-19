import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'domain',
        data: { pageTitle: 'nHipsterApp.domain.home.title' },
        loadChildren: () => import('./domain/domain.module').then(m => m.DomainModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
