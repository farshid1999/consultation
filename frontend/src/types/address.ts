/** Mirrors AddressSerializer's field list exactly. */
export interface Address {
  id?: number;
  country: string;
  province: string;
  city: string;
  street: string;
  postal_code: string;
  description?: string | null;
}

/** Payload shape for creating/updating an address (id is server-assigned). */
export type AddressInput = Omit<Address, "id"> & {
  postal_code?: string;
  description?: string | null;
};
