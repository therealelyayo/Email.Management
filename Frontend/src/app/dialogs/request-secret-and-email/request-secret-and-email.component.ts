import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecipientAndSecret } from 'src/app/models/recipient.and.secret';

@Component({
  selector: 'app-request-secret-and-email',
  templateUrl: './request-secret-and-email.component.html',
  styleUrls: ['./request-secret-and-email.component.scss']
})
export class RequestSecretAndEmailComponent {
  form: FormGroup;
  constructor(fb: FormBuilder, 
    public dialogRef: MatDialogRef<RequestSecretAndEmailComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: RecipientAndSecret) {
    this.form = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'secret': ['', [Validators.required]],
      'save': [true]
    });

    if(this.data){
      this.form.get('email')?.setValue(this.data.email);
      this.form.get('secret')?.setValue(this.data.secret);
    }
  }

  send(){
    this.dialogRef.close(this.form.value)
  }

  cancel(){
    this.dialogRef.close();
  }

}
