import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AuthService } from "./../../services/auth.service";

@Component({
  selector: "app-inside",
  templateUrl: "./inside.page.html",
  styleUrls: ["./inside.page.scss"],
})
export class InsidePage implements OnInit {
  data;
  constructor(private authService: AuthService, private storage: Storage) {}

  ngOnInit() {}
  loadSpecialInfo() {
    this.authService.getSpecialData().subscribe((res) => {
      this.data = res;
    });
  }

  logout() {
    this.authService.logout();
  }
}
