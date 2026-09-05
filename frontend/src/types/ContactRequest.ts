export type ContactType = 'phone' | 'messenger' | 'email';

export type MessengerType = 'whatsapp' | 'telegram' | 'eitaa' | 'rubika' | 'bale';

export interface ContactRequest {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  contact_type: ContactType;
  messenger_type: MessengerType | null;
  email: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ContactRequestCreateInput {
  first_name: string;
  last_name: string;
  phone: string;
  contact_type: ContactType;
  messenger_type?: MessengerType | null;
  email?: string | null;
  message?: string | null;
}