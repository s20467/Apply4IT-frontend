import { Address } from "./address.model";

export class UserPatchDto {
  password: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  birthdate: Date | null = null;
  address: Address | null = null;
  description: string | null = null;
}
