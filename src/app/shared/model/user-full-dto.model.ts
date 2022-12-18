import { Address } from "./address.model";
import { EducationFullDto } from "./education-full-dto.model";
import { ExperienceFullDto } from "./experience-full-dto.model";


export class UserFullDto {
  authorities: string[];
  id: number;
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  address: Address;
  photo: string;
  description: string;
  educations: EducationFullDto[];
  experiences: ExperienceFullDto[];
}
