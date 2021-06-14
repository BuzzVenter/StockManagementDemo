import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, NgForm, FormBuilder, FormArray } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { CurrencyPipe } from "@angular/common";
import { stringify } from "@angular/compiler/src/util";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "src/app/auth/auth.service";

interface Car {
  value: string;
  viewValue: string;
}

interface IAccessories {
  id: number;
  accessoryName: string;
  description: string;
}

function validateSize(arr: FormArray) {
  return arr.length > 3 ? {
    invalidSize: true
  } : null;
}

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  private posts: Post[] = [];
  post: Post;
  isLoading = false;
  form: FormGroup;
  accessories: FormGroup;
  images = [];
  accessoriesArray = [
    {id: 1, accessoryName: "ABS", description: "Brakes system"},
    {id: 2, accessoryName: "Alarm", description: "Security system"},
    {id: 3, accessoryName: "Park distance", description: "Comfort system"},
    {id: 4, accessoryName: "Towbar", description: "Utility system"},
    {id: 5, accessoryName: "Aircon", description: "Comfort system"},
    {id: 6, accessoryName: "Other" , description: "Please specify"}
  ];
  fileName = '';

  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  // Template props
  numCols = 0;
  rowHeight = '1:1';
  gutterSize = '0';

  // Defaults props
  defaultCols = 3;
  defaultRowHeight = '1:1';
  defaultGutterSize = '10';

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = this.fb.group({
      'title': [null, {validators: [Validators.required]}],
      'regNo': [null, {validators: [Validators.required]}],
      'make': [null, {validators: [Validators.required]}],
      'model': [null, {validators: [Validators.required]}],
      'modelYear': [null, {validators: [Validators.required]}],
      'kms': [null, {validators: [Validators.required]}],
      'colour': [null, {validators: [Validators.required]}],
      'vin': [null, {validators: [Validators.required]}],
      'retailPrice': [null, {validators: [Validators.required]}],
      'costPrice': [null, {validators: [Validators.required]}],
      'accessories': [],
      'images': [null, {validators: [Validators.required], asyncValidators: [mimeType], validateSize}]
    });
    // this.form.setControl('accessories', this.setExistingAccessories())
    this.form.valueChanges.subscribe( myform => {
      if (myform.retailprice) {
        this.form.patchValue({
          retailprice: this.currencyPipe.transform(myform.retailprice.replace(/\D/g, '').replace(/^0+/, ''), 'ZAR', 'symbol', '1.0-0')
        }, {emitEvent: false});
      }
      if (myform.costprice) {
        this.form.patchValue({
          costprice: this.currencyPipe.transform(myform.costprice.replace(/\D/g, '').replace(/^0+/, ''), 'ZAR', 'symbol', '1.0-0')
        }, {emitEvent: false});
      }
    });
    this.form.controls.accessories.setValue([
      {id: 1, accessoryName: "ABS", description: "Brakes system"},
      {id: 2, accessoryName: "Alarm", description: "Security system"},
      {id: 3, accessoryName: "Park distance", description: "Comfort system"},
      {id: 4, accessoryName: "Towbar", description: "Utility system"},
      {id: 5, accessoryName: "Aircon", description: "Comfort system"},
      {id: 6, accessoryName: "Other" , description: "Please specify"}
    ]);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            regNo: postData.regNo,
            make: postData.make,
            model: postData.model,
            modelYear: postData.modelYear,
            kms: postData.kms,
            colour: postData.colour,
            vin: postData.vin,
            retailPrice: postData.retailPrice,
            costPrice: postData.costPrice,
            accessories: postData.accessories,
            imagePaths: null,
            creator: postData.creator,
            dtCreated: null,
            dtUpdated: null
          }
          this.form.setValue({
            'title': this.post.title,
            'regNo': this.post.regNo,
            'make': this.post.make,
            'model': this.post.model,
            'modelYear': this.post.modelYear,
            'kms': this.post.kms,
            'colour': this.post.colour,
            'vin': this.post.vin,
            'retailPrice': this.post.retailPrice,
            'costPrice': this.post.costPrice,
            'accessories': this.post.accessories,
            'images': this.post.imagePaths
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  // get accessoryArray(): FormArray {
  //   return this.form.get('accessories') as FormArray;
  // }

  // setExistingAccessories(accessorySets: IAccessories[]): FormArray {
  //   const formArray = new FormArray([]);
  //   accessorySets.forEach(a => {
  //     formArray.push(this.fb.group({
  //       accessoryName: a.accessoryName,
  //       description: a.description
  //     }));
  //   });

  //   return formArray;
  // }

  // removeAccessoriesClick(accessGroupIndex: number): void {
  //   const accessoriesFormArray = <FormArray>this.form.get('accessories');
  //   accessoriesFormArray.removeAt(accessGroupIndex);
  //   accessoriesFormArray.markAsDirty();
  //   accessoriesFormArray.markAsTouched();
  // }

  // addAccessoriesClick(): void {
  //   (<FormArray>this.form.get('accessories')).push(this.createItem({
  //     accessoryName: ['', Validators.required],
  //     description: ['', Validators.required]
  //   }));
  // }

  // addAccessoriesFormGroup(): FormGroup {
  //   return this.fb.group({
  //     accessoryName: ['', Validators.required],
  //     description: ['', Validators.required]
  //   });
  // }

  // setCardView() {
  //   this.numCols = this.defaultCols;
  //   this.rowHeight = this.defaultRowHeight;
  //   this.gutterSize = this.defaultGutterSize;
  // }

  // uploadFile(evt){
    //   // evt is an array of the file(s) dropped on our div. Here we're assuming only one file has been uploaded
    //   let payload = new FormData();
    //   payload.append('data', evt[0]);
    //   // File can now be uploaded by doing an http post with the payload
    // }


  createItem(data): FormGroup {
    return this.fb.group(data);
  }

  // get images() {
  //   return this.form.get('images') as FormArray;
  // }

  onImagePicked(event: Event) {
    if ((event.target as HTMLInputElement).files && (event.target as HTMLInputElement).files[0]) {
      var fileCount = (event.target as HTMLInputElement).files.length;
      for (let i = 0; i < fileCount; i++) {
        const file: File = (event.target as HTMLInputElement).files[i];
        if (file) {
          this.fileName = file.name;
          this.form.get("images").updateValueAndValidity();
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.images.push(event.target.result)  //Base64 string for preview image

          };
          this.form.patchValue({ images: file });
          reader.readAsDataURL((event.target as HTMLInputElement).files[i]);
        }
      }
    }
  }

  removeImage(imageIndex) {
    this.images.splice(imageIndex, 1);
  }

  onSavePost() {
    // if (this.form.invalid) {
    //   console.log(this.form.invalid)
    //   return;
    // }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.SavePost(this.form.value);
    //   const postData = new FormData();
    // let accessJSON = JSON.stringify(this.form);
    // postData.append("title", this.form());
    // postData.append("regNo", regNo);
    // postData.append("make", make);
    // postData.append("model", model);
    // postData.append("modelYear", modelYear);
    // postData.append("kms", kms);
    // postData.append("colour", colour);
    // postData.append("vin", vin);
    // postData.append("retailPrice", retailPrice);
    // postData.append("costPrice", costPrice);
    // postData.append("accessories[]", accessJSON);
    // console.log(images);
    // if (images.length > 0) {
    //   for (let image of images) {
    //     let imageFile: File = image;
    //     console.log(imageFile);
    //     postData.append("images[]", imageFile, imageFile.name);
    //   }
    // }
    //   this.http
    //   .post<any>(
    //     "http://localhost:3000/api/posts",
    //     this.form
    //   )
    //   .subscribe(responseData => {
    //      console.log(responseData)
    //     this.router.navigate(["/"]),
    //     (errer) => console.log(errer)
    //   });
      // this.postsService.addPost(
      //   this.form.value.title,
      //   this.form.value.regNo,
      //   this.form.value.make,
      //   this.form.value.model,
      //   this.form.value.modelYear,
      //   this.form.value.kms,
      //   this.form.value.colour,
      //   this.form.value.vin,
      //   this.form.value.retailPrice,
      //   this.form.value.costPrice,
      //   this.form.value.accessories,
      //   this.form.value.images
      // );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.regNo,
        this.form.value.make,
        this.form.value.model,
        this.form.value.modelYear,
        this.form.value.kms,
        this.form.value.colour,
        this.form.value.vin,
        this.form.value.retailPrice,
        this.form.value.costPrice,
        this.form.value.accessories,
        this.form.value.images,
        this.form.value.dtCreated,
        this.form.value.dtUpdated
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
