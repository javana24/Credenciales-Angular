import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/local-store-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  onClick() {
    this.router.navigate(['/register']);
  }

  formLogin;

  //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]
  constructor(private formSvc:FormBuilder,
    private auth:AuthService,
    private router: Router
  ){
    this.formLogin = this.formSvc.group({
      'email':['', [Validators.required, Validators.email]],
      'password':['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    });
  }




  onSubmit() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const formValue = this.formLogin.value;

    try {
      this.auth.login({
        email: formValue.email!,
        password: formValue.password!
      });

      alert('Usuario logueado correctamente');

      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      alert(error.message || 'Error al hacer el login');
    }
  }

  getError(control:string){

    switch(control){
      case 'email':
        if(this.formLogin.controls.email.errors!=null &&
           Object.keys(this.formLogin.controls.email.errors).includes('required'))
           return "El campo email es requerido";
        else if(this.formLogin.controls.email.errors!=null &&
           Object.keys(this.formLogin.controls.email.errors).includes('email'))
           return "El email no es correcto";

        break;
      case 'password':
        if(this.formLogin.controls.password.errors!=null &&
           Object.keys(this.formLogin.controls.password.errors).includes('required'))
           return "El campo email es requerido";
        break;
      default:return "";
    }
    return "";
  }

}
