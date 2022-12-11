import { Address } from "./address.model";

export class CompanyRegistrationDto {
  name: string;
  description: string;
  address: Address;
  contactEmail: string;
}
