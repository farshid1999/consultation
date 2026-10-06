export interface PublicInformation {
  id: string;
  title: string;
  text: string;
  file: string | null;
  children: PublicInformation[];
}

export interface PublicStaffLine {
  id: string;
  title: string;
}

export interface PublicStaff {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  position: string;
  degree: string | null;
  bio: string | null;
  lines: PublicStaffLine[];
  informations: PublicInformation[];
}

export interface PublicStaffListParams {
  search?: string;
  line_id?: string;
}