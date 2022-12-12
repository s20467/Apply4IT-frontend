import { Address } from "./address.model";

export class UserCreationDto {
  password: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  address: Address;
}
