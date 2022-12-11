import {OfferMinimalDto} from "./offer-minimal-dto.model";
import {UserMinimalDto} from "./user-minimal-dto.model";
import {Address} from "./address.model";

export class CompanyFullDto {
  id: number;
  name: string;
  description: string;
  logoPhoto: string;
  address: Address;
  enabled: boolean;
  contactEmail: string;

  latestOffersSample: OfferMinimalDto[];

  recruitersSample: UserMinimalDto[];

  isCurrentUserOwner: boolean;
  isCurrentUserRecruiter: boolean;
}
