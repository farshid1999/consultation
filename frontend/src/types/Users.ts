export interface Address {
  id: number;
  country: string;
  province: string;
  city: string;
  street: string;
  postal_code: string;
  description: string;
}

export interface Club {
  id: number;
  name: string;
  address: Address | null;
}

export interface Information {
  id: number;
  title: string;
  text: string;
  file: string | null;
  parent: number | null;
  children: Information[];
}

export interface UserDetail {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  land_line: string;
  is_student: boolean;
  degree: string;
  job: string;
  sport_discipline: string;
  professional_background: string;
  referral_code: string;
  avatar: string | null;
  bio: string;
  birth_date: string | null;
  address: Address | null;
  club: Club | null;
  informations: Information[];
}