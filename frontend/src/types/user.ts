import type { Address, AddressInput } from "./address";
import type { Club, ClubInput } from "./club";
import type { InformationInput, InformationRead } from "./information";
import type { CreateUserFormValues, UpdateUserFormValues } from "@/schemas/user";

/** Mirrors UserListSerializer — used inside StaffListSerializer. */
export interface UserListItem {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_student: boolean;
  /** Flattened to the club's name by the backend (`source="club.name"`). */
  club: string | null;
  /** Flattened to "country - city" by the backend, or null if no address. */
  address: string | null;
  avatar: string | null;
}

/**
 * Mirrors UserDetailSerializer — `exclude = (password, groups,
 * user_permissions)`, so this is effectively every other User model field.
 */
export interface UserDetail {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  land_line: string | null;
  is_student: boolean;
  degree: string | null;
  job: string | null;
  sport_discipline: string | null;
  professional_background: string | null;
  referral_code: string | null;
  address: Address | null;
  club: Club | null;
  avatar: string | null;
  bio: string | null;
  birth_date: string | null;
  informations: InformationRead[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

/** Mirrors UserCreateSerializer exactly. */


/**
 * Mirrors UserUpdateSerializer — identical field list to create, but every
 * field is optional (partial update) and password is optional too.
 */
export type UserCreateInput = CreateUserFormValues;
export type UserUpdateInput = UpdateUserFormValues;
