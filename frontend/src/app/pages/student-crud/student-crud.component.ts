import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { ApiValidationError } from '../../types/api-error';
import { Subject, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-student-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-crud.component.html'
})
export class StudentCrudComponent {
  private studentService = inject(StudentService);
  private fb = inject(FormBuilder);

  private refresh$ = new Subject<void>();

  // UI state
  loading = signal(false);
  apiError = signal<string | null>(null);

  // Modal state
  isModalOpen = signal(false);
  modalTitle = computed(() => (this.form.controls.id.value ? 'Editar estudiante' : 'Nuevo estudiante'));

  // Search
  search = this.fb.control('');

  // Form con validaciones (frontend)
  form = this.fb.nonNullable.group({
    id: 0,
    name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email, Validators.maxLength(120)]),
    age: this.fb.nonNullable.control(0, [Validators.min(0), Validators.max(120)])
  });

  // Errores del backend por campo (Zod)
  fieldErrors = signal<Record<string, string>>({});

  students$: Observable<Student[]> = merge(
    this.search.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
    this.refresh$
  ).pipe(
    tap(() => {
      this.loading.set(true);
      this.apiError.set(null);
    }),
    switchMap(() =>
      this.studentService.getAll(this.search.value ?? '').pipe(
        catchError(() => {
          this.apiError.set('No se pudo cargar la lista.');
          return of([]);
        })
      )
    ),
    tap(() => this.loading.set(false))
  );

  openCreate() {
    this.fieldErrors.set({});
    this.apiError.set(null);
    this.form.reset({ id: 0, name: '', email: '', age: 0 });
    this.isModalOpen.set(true);
  }

  openEdit(s: Student) {
    this.fieldErrors.set({});
    this.apiError.set(null);
    this.form.setValue({ id: s.id, name: s.name, email: s.email, age: s.age });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submit() {
    this.fieldErrors.set({});
    this.apiError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, ...data } = this.form.getRawValue();
    const req$ = id ? this.studentService.update(id, data) : this.studentService.create(data);

    this.loading.set(true);

    req$.pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        const e = err?.error as ApiValidationError | undefined;

        if (e?.errors?.length) {
          const map: Record<string, string> = {};
          for (const it of e.errors) map[it.path] = it.message;
          this.fieldErrors.set(map);
          this.apiError.set('Revisa los campos marcados.');
        } else {
          this.apiError.set('No se pudo guardar.');
        }
        return of(null);
      })
    ).subscribe((ok) => {
      if (!ok) return;
      this.closeModal();
      this.refresh$.next();
    });
  }

  remove(id: number) {
    if (!confirm('¿Eliminar este estudiante?')) return;

    this.loading.set(true);
    this.studentService.delete(id).pipe(
      tap(() => this.loading.set(false)),
      catchError(() => {
        this.loading.set(false);
        this.apiError.set('No se pudo eliminar.');
        return of(null);
      })
    ).subscribe((ok) => {
      if (!ok) return;
      this.refresh$.next();
    });
  }

  // Helpers plantilla
  fe = (name: string) => this.fieldErrors()[name];
  c = (name: 'name' | 'email' | 'age') => this.form.controls[name];
}
