import type { Address, AddressInput } from "./address";

/** Mirrors ClubSerializer. */
export interface Club {
  id?: number;
  name: string;
  address: Address;
}

export interface ClubInput {
  id?: number;
  name: string;
  address: AddressInput;
}
