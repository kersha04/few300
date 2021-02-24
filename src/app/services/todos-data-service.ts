import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TodoEntity } from '../reducers/todos.reducer';

@Injectable()
export class TodosDataService {
  readonly baseUrl = environment.apiUrl + 'todos/';

  constructor(private client: HttpClient) { }

  getAllTodos(): Observable<TodoEntity[]> {
    return this.client.get<GetTodosResponse>(this.baseUrl).pipe(
      map(response => response.data)
    );

  }
}
interface GetTodosResponse {
  data: TodoEntity[];

}
