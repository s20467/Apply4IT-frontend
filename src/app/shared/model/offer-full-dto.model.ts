import { Address } from "./address.model";
import { CompanyMinimalDto } from "./company-minimal-dto.model";
import { ExpectationMinimalDto } from "./expectation-minimal-dto.model";
import {OfferAdvantageMinimalDto} from "./offer-advantage-minimal-dto.model";
import {LocalizationFullDto} from "./localization-full-dto.model";
import {CategoryFullDto} from "./category-full-dto.model";

export class OfferFullDto{
  id: number;
  title: string;
  description: string;
  address: Address;
  localization: LocalizationFullDto;
  company: CompanyMinimalDto;
  creationDate: Date;
  closingDate: Date;
  minSalaryPln: number;
  maxSalaryPln: number;
  firstJobPossibility: boolean;
  categories: CategoryFullDto[];
  expectations: ExpectationMinimalDto[];
  offerAdvantages: OfferAdvantageMinimalDto[];
  applicationsNumber: number | null;
  remotePossibility: boolean;
  isSavedByCurrentUser: boolean;
  hasCurrentUserApplied: boolean | null;
}
