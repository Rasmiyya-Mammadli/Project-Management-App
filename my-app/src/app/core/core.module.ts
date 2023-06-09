import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { appReducers } from './store/reducers/app.reducers';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { SearchBarComponent } from './pages/search-bar/search-bar.component';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page/search-results-page.component';
import { SearchResultComponent } from './pages/search-results-page/search-result/search-result.component';
import { SharedModule } from '../backend/shared.module';
import { SpinnerComponent } from './spinner/spinner/spinner.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    WelcomePageComponent,
    NotFoundPageComponent,
    ConfirmModalComponent,
    SearchBarComponent,
    SearchResultsPageComponent,
    SearchResultComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducers),
    SharedModule,
  ],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule {}
