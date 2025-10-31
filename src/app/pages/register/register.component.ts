import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  onClick() {
  this.router.navigate(['./login']);
  }

  formRegister;

  constructor(
    private formSvc: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.formRegister = this.formSvc.group({
      'usuario': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'password':['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]]
    });
  }

  onSubmit() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }

    const formValue = this.formRegister.value;

    try {
      this.auth.register({
        email: formValue.email!,
        password: formValue.password!
      });

      alert('Usuario registrado correctamente');

      this.router.navigate(['/login']);

    } catch (error: any) {
      alert(error.message || 'Error al registrar el usuario');
    }
  }

  getError(control: string) {
    switch (control) {
      case 'usuario':
        if (this.formRegister.controls.usuario.errors?.['required'])
          return 'El campo usuario es requerido';
        break;

      case 'email':
        if (this.formRegister.controls.email.errors?.['required'])
          return 'El campo email es requerido';
        else if (this.formRegister.controls.email.errors?.['email'])
          return 'El email no es correcto';
        break;

      case 'password':
        if (this.formRegister.controls.password.errors?.['required'])
          return 'El campo contraseña es requerido';
        break;

      default:
        return '';
    }
    return '';
  }

}
