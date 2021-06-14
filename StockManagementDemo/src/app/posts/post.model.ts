import { CurrencyPipe } from "@angular/common";

export interface Post {
  id: string;
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
  dtCreated: Date;
  dtUpdated: Date;
}
