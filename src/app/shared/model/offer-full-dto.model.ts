import { Address } from "./address.model";
import { CompanyMinimalDto } from "./company-minimal-dto.model";
import { ExpectationMinimalDto } from "./expectation-minimal-dto.model";
import {OfferAdvantageMinimalDto} from "./offer-advantage-minimal-dto.model";

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
  expectations: ExpectationMinimalDto[];
  offerAdvantages: OfferAdvantageMinimalDto[];
  applicationsNumber: number | null;
  remotePossibility: boolean;
  isSavedByCurrentUser: boolean;
}
