import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Storage } from "@ionic/storage";
import { tap, catchError } from "rxjs/operators";
import { Platform, AlertController } from "@ionic/angular";

const TOKEN_KEY = "access_token";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  url = "http://localhost:3000";
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private plt: Platform,
    private alertController: AlertController
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then((token) => {
      if (token) {
        let decode = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decode;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  login(credentials) {
    return this.http.post(`${this.url}/login`, credentials).pipe(
      tap((res) => {
        this.storage.set(TOKEN_KEY, res["token"]);
        this.user = this.helper.decodeToken(res["token"]);
        this.authenticationState.next(true);
      }),
      catchError((e) => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  register(credentials) {
    this.http.post(`${this.url}/signup`, credentials).pipe(
      catchError((e) => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getSpecialData() {
    return this.http.get(`${this.url}/signup`).pipe(
      catchError((e) => {
        let status = e.status;
        if (status === 401) {
          this.showAlert("You are unauthorized for this");
          this.logout();
        }
        throw new Error(e);
      })
    );
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: "Error",
      buttons: ["OK"],
    });
    alert.then((alert) => alert.present());
  }
}
