import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormsCompromissosViewModel } from "../models/forms-compromisso.view-model";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { ListarCompromissosViewModel } from "../models/listar-compromissos.view-model";
import { VisualizarCompromissosViewModel } from "../models/visualizar-compromisso.view-model";

@Injectable()
export class CompromissosService {

  private endpoint: string =
  'https://e-agenda-web-api.onrender.com/api/compromissos/';

  constructor(private http: HttpClient){}

  public inserir(compromissos: FormsCompromissosViewModel): Observable<FormsCompromissosViewModel> {
      return this.http.post<any>(this.endpoint, compromissos, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err: HttpErrorResponse) => this.processarErroHttp(err)));
  }

  public editar(id: string, compromissos: FormsCompromissosViewModel){
    return this.http.put<any>(
      this.endpoint + id, compromissos, this.obterHeadersAutorizacao())
      .pipe(map((res) => res.dados),
      catchError((err: HttpErrorResponse) => this.processarErroHttp(err)));
  }

  public excluir(id: string): Observable<any> {
    return this.http.delete<any>(this.endpoint+id, this.obterHeadersAutorizacao())
    .pipe(
      catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
    );
  }

  public selecionarTodos(): Observable<ListarCompromissosViewModel[]> {
    return this.http.get<any>(this.endpoint, this.obterHeadersAutorizacao())
    .pipe(map((res) => res.dados),
    catchError((err: HttpErrorResponse) => this.processarErroHttp(err)));
  }

  public selecionarPorId(id: string): Observable<FormsCompromissosViewModel>{
    return this.http.get<any>(this.endpoint+id, this.obterHeadersAutorizacao())
    .pipe(map((res) => res.dados),
    catchError((err: HttpErrorResponse) => this.processarErroHttp(err)));
  }

  public selecionarContatoCompletoPorId(id: string): Observable<VisualizarCompromissosViewModel>{
    return this.http.get<any>(this.endpoint + 'visualizacao-completa/' + id, this.obterHeadersAutorizacao())
    .pipe(map((res) => res.dados),
    catchError((err: HttpErrorResponse) => this.processarErroHttp(err)));
  }

  private processarErroHttp(erro: HttpErrorResponse){
    let mensagemErro = '';

    if(erro.status == 0)
      mensagemErro = 'Ocorreu um erro ao processar a requisição.';
      
    if(erro.status == 401)
      mensagemErro = 'O usuário não está autorizado. Efetue o login e tente novamente.';

    else mensagemErro = erro.error?.erros(0);

    return throwError(() => new Error(mensagemErro));
  }


  private obterHeadersAutorizacao(){
    const token = environment.apiKey;
  
    return{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:`Bearer ${token}`,
      }),
    };
  }
}