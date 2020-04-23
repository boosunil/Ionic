import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  credentialsform: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.credentialsform = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });
  }

  onSubmit() {
    this.authService.login(this.credentialsform.value).subscribe();
  }
}
