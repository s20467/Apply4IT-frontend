import {Address} from "./address.model";
import {CompanyMinimalDto} from "./company-minimal-dto.model";

export class OfferFullDto{
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
  expectations: string[];
  offerAdvantages: string[];
  applicationsNumber: number | null;
  remotePossibility: boolean;
  isSavedByCurrentUser: boolean;
}
