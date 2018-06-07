import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) { }

  addNewProject(data): Observable<any> {
    return this.http.post(environment.apiEndpoint + 'company_project/', data, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

  getProjectList(params): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'all_company_project/?' + params, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

  getProjectListBycompany(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'company_project_dropdown/' + id +'/', {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

  getProjectDetails(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'all_company_project/' + id + '/', {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

  updateProject(data): Observable<any> {
    return this.http.put(environment.apiEndpoint + 'company_project/' + data.id + '/', data, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

  activeInactiveProject(data): Observable<any> {
    return this.http.patch(environment.apiEndpoint + 'company_project/' + data.id + '/', data, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

  deleteProject(data): Observable<any> {
    return this.http.patch(environment.apiEndpoint + 'company_project/' + data.id + '/',data, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + localStorage.getItem('logedUserToken'))
    })
  }

}
