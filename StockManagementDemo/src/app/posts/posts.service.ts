import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";
import { CurrencyPipe } from "@angular/common";
import { stringify } from "@angular/compiler/src/util";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  formData: FormData;

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number, regexString: string) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}&searchtext=${regexString}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                regNo: post.regNo,
                make: post.make,
                model: post.model,
                modelYear: post.modelYear,
                kms: post.kms,
                colour: post.colour,
                vin: post.vin,
                retailPrice: post.retailPrice,
                costPrice: post.costPrice,
                accessories: post.accessories,
                imagePaths: post.imagePaths,
                dtCreated: post.DTCreated,
                dtUpdated: post.DTUpdated,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      regNo: string;
      make: string;
      model: string;
      modelYear: number;
      kms: number;
      colour: string;
      vin: string;
      retailPrice: string;
      costPrice: string;
      accessories: string[];
      imagePaths: string[];
      creator: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string,  regNo: string, make: string, model: string, modelYear:string, kms: string,
    colour: string, vin: string, retailPrice: string, costPrice: string, accessories: any, images: any) {

    const postData = new FormData();
    let accessJSON = JSON.stringify(accessories);
    postData.append("title", title);
    postData.append("regNo", regNo);
    postData.append("make", make);
    postData.append("model", model);
    postData.append("modelYear", modelYear);
    postData.append("kms", kms);
    postData.append("colour", colour);
    postData.append("vin", vin);
    postData.append("retailPrice", retailPrice);
    postData.append("costPrice", costPrice);
    postData.append("accessories[]", accessJSON);
    console.log(images);
    if (images.length > 0) {
      for (let image of images) {
        let imageFile: File = image;
        console.log(imageFile);
        postData.append("images[]", imageFile, imageFile.name);
      }
    }
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, regNo: string, make: string, model: string, modelYear:string, kms: string,
    colour: string, vin: string, retailPrice: any, costPrice: any, accessories: any, images: any, dtCreated: any, dtUpdated: any) {
    let rand = Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    });
    let postData: Post | FormData;
    let dateNow = Date.now();
    dtUpdated = stringify(dateNow);
    if (typeof(images) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("regNo", regNo);
      postData.append("make", make);
      postData.append("model", model);
      postData.append("modelYear", modelYear);
      postData.append("kms", kms);
      postData.append("colour", colour);
      postData.append("vin", vin);
      postData.append("retailPrice", retailPrice);
      postData.append("costPrice", costPrice);
      postData.append("accessories", accessories);
      for (let image in images) {
        postData.append("images", image);
      }
      postData.append("dtCreated", dtCreated);
      postData.append("dtUpdated", dtUpdated);
    } else {
      postData = {
        id: id,
        title: title,
        regNo: regNo,
        make: make,
        model: model,
        modelYear: Number(modelYear),
        kms: Number(kms),
        colour: colour,
        vin: vin,
        // retailPrice: Number(rand.format(Number(retailPrice))),
        // costPrice: Number(rand.format(Number(costPrice))),
        retailPrice: retailPrice,
        costPrice: costPrice,
        accessories: [accessories],
        imagePaths: [images],
        creator: null,
        dtCreated: null,
        dtUpdated: dtUpdated
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/posts/" + postId);
  }

  SavePost(formData: FormData) {
    console.log(formData);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts", formData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }
}
