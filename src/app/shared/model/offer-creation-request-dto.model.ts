import { Address } from "./address.model";
import { ExpectationMinimalDto } from "./expectation-minimal-dto.model";
import { OfferAdvantageMinimalDto } from "./offer-advantage-minimal-dto.model";


export class OfferCreationRequestDto{
  title: string;
  description: string;
  address: Address;
  localizationId: number;
  companyId: number;
  closingDate: Date;
  minSalaryPln: number;
  maxSalaryPln: number;
  firstJobPossibility: boolean;
  remotePossibility: boolean;
  categoryIds: number[];
  expectations: ExpectationMinimalDto[];
  offerAdvantages: OfferAdvantageMinimalDto[];
}
