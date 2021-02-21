import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Template } from 'src/app/models/template';
import { TemplateService } from 'src/app/services/template.service';
import * as  Mustache from 'mustache';
import { Pair } from 'src/app/models/pair';
import { TestTemplate } from 'src/app/models/test.template';
import { MailService } from 'src/app/services/mail.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  id: number = 0;
  form: FormGroup;
  editorOptions = {theme: 'vs-white', language: 'html'};
  emails: {id: number, name: string}[] = []
  pairs: Pair<string, string>[] = [
    {
      key: 'name',
      value: 'John Doe'
    }
  ];

  constructor(fb: FormBuilder, 
    private route: ActivatedRoute, 
    private templateService: TemplateService, 
    private mailService: MailService,
    private toastr: ToastrService) {
    this.form = fb.group({
      'name': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'subject': ['', [Validators.required]],
      'isHtml': [true],
      'content': ['<html> Hello {{ name }}! </html>', [Validators.required]],
      'mailId': [0]
    });

    this.form.get('content')?.valueChanges.subscribe(_ => this.preview())

    this.mailService.listAll().subscribe(mails => {
      this.emails = mails;
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.id = +params['id']; 
        this.templateService.get(this.id).subscribe(template => {
          this.form.get('content')?.setValue(template.content)
          this.form.get('name')?.setValue(template.name);
          this.form.get('description')?.setValue(template.description);
          this.form.get('isHtml')?.setValue(template.isHtml);
          this.form.get('mailId')?.setValue(template.mailId);
          this.form.get('subject')?.setValue(template.subject);    
        })
      }
   });
  }

  save(){
    const template = this.form.value as Template;
    template['id'] = this.id;
    this.templateService.save(template).subscribe(template => {
      this.id = template.id;
      this.toastr.success('Template saved successfully!');
    });
  }

  preview(){
    let iframe = document.getElementById('preview') as HTMLIFrameElement;
    let params: {[key: string]: string} = {};
    this.pairs.forEach(x => params[x.key] = x.value);

    let content = Mustache.render(this.form.value.content, params);
    iframe.src = "data:text/html;charset=utf-8," + escape(content);
  }

  removeParam(index: number){
    this.pairs.splice(index, 1);
  }

  addParam(){
    this.pairs.push(new Pair())
  }

  test(){
    let params: {[key: string]: string} = {};
    this.pairs.forEach(x => params[x.key] = x.value);

    console.log(this.form.get('mailId'))

    let template = new TestTemplate();
    template.content = this.form.get('content')?.value;
    template.name = this.form.get('name')?.value;
    template.description = this.form.get('description')?.value;
    template.isHtml = this.form.get('isHtml')?.value;
    template.mailId = this.form.get('mailId')?.value;
    template.subject = this.form.get('subject')?.value;
    template.secret = 'e8431f09-5612-450c-8d09-ea4bcbfe5d56';

    template.recipient = {
      email: 'simas.lucas@hotmail.com',
      args: params
    };
    this.templateService.test(template).subscribe(() => {
      this.toastr.success('E-mail sent successfully!');
    })
  }
}
