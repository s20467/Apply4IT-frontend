import { CompanyMinimalDto } from "./company-minimal-dto.model";
import { Address } from "./address.model";


export class OfferMinimalDto{
  id: number;
  title: string;
  description: string;
  address: Address;
  localization: string;
  company: CompanyMinimalDto;
  creationDate: Date;
  closingDate: Date;
  minSalaryPln: number;
  maxSalaryPln: number;
  firstJobPossibility: boolean;
  categories: string[];
  remotePossibility: boolean;
}
