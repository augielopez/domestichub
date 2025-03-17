import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AccountsService} from "../services/accounts.service";
import {VwAccount} from "../models/account.model";


@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent implements OnInit {
  @Input() accountData?: VwAccount;
  @Output() formSubmitted = new EventEmitter<VwAccount>();
  accountForm!: FormGroup;
  isEditMode = false;

  constructor(
      private fb: FormBuilder,
      private accountService: AccountsService,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      account_name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      url: [''],
      is_bill: [false]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.accountService.getAccount(id).subscribe(account => {
        this.accountForm.patchValue(account);
      });
    }
  }

  onSubmit(): void {
    this.formSubmitted.emit(this.accountForm.value); // Emit form data
    if (this.accountForm.valid) {
      if (this.isEditMode) {
        this.accountService.updateAccount(this.accountForm.value).subscribe();
      } else {
        this.accountService.createAccount(this.accountForm.value).subscribe();
      }
      this.router.navigate(['/accounts']);
    }
  }
}

