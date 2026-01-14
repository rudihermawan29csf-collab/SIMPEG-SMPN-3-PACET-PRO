
export enum Role {
  ADMIN = 'ADMIN',
  PEGAWAI = 'PEGAWAI',
}

export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan',
}

export enum EmpStatus {
  PNS = 'PNS',
  PPPK = 'PPPK',
  HONORER = 'Honorer',
  GTT = 'GTT',
  PTT = 'PTT',
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Suami/Istri' | 'Anak' | 'Ayah' | 'Ibu';
  birthDate: string;
  education?: string;
  isDependent: boolean;
  status?: string; // Kandung/Tiri/Angkat or Hidup/Meninggal
}

export interface DocumentDefinition {
  id: string;
  name: string;
  group: string;
  isRequired: boolean;
}

export interface DocumentFile {
  id: string;
  type: string; // e.g., 'KTP', 'KK' matches DocumentDefinition.name
  fileName?: string;
  uploadDate?: string;
  url?: string;
  status: 'missing' | 'uploaded' | 'verified';
  group?: string; // Category of the document
}

export interface Employee {
  id: string;
  // Tab 1: Pribadi
  fullName: string;
  frontTitle?: string;
  backTitle?: string;
  nik: string;
  nip?: string;
  nuptk?: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender;
  religion: string;
  maritalStatus: string;
  address: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone: string;
  email: string;

  // Tab 2: Kepegawaian
  empStatus: EmpStatus;
  empType: 'Guru' | 'Tendik';
  position: string;
  mainDuty?: string;
  unit: string;
  subject?: string;
  tmtStart?: string;
  teachingHours?: number;
  skNumber?: string;
  skOfficial?: string;

  // Tab 3: ASN / DUK Fields
  asnType?: 'PNS' | 'PPPK';
  golongan?: string;
  pangkat?: string;
  tmtGolongan?: string;
  workingYear?: number;
  workingMonth?: number;
  totalWorkingYear?: number; // MK Seluruhnya Thn
  totalWorkingMonth?: number; // MK Seluruhnya Bln
  karpeg?: string;
  taspen?: string;
  bpjsKes?: string;
  bpjsKet?: string;
  npwp?: string;
  salaryAccount?: string;
  bankName?: string;
  isCertified?: boolean;
  certNumber?: string;
  nrg?: string;
  certYear?: number;
  
  // DUK Specific
  masaKpyad?: string;
  tglSKBerkala?: string;
  catatanMutasi?: string;

  // Tab 4: Non-ASN
  contractNumber?: string;
  contractStart?: string;
  contractEnd?: string;
  honorSource?: string;
  honorAmount?: number;
  honorAccount?: string;
  honorBank?: string;

  // Tab 5: Pendidikan
  lastEducation: string;
  major?: string;
  university?: string;
  gradYear?: number;
  diplomaNumber?: string;

  // Tab 6: Keluarga
  familyMembers: FamilyMember[];

  // Tab 7: Dokumen (Managed via relations usually, but simplified here)
  documents: DocumentFile[];

  // Tab 8: Status
  completionPercentage: number;
  verificationStatus: 'Belum Diverifikasi' | 'Disetujui' | 'Perlu Perbaikan';
  adminNotes?: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
  employeeId?: string; // Linked employee profile
  password?: string; // Added for API based authentication
}

// Raw Data Interface for DUK Import
export interface RawDukData {
  id: number;
  nama: string;
  nip: string;
  karpeg: string;
  lp: string;
  pangkatNama: string;
  pangkatTmt: string;
  jabatanNama: string;
  jabatanTmt: string;
  mkGolTh: string;
  mkGolBln: string;
  mkSelTh: string;
  mkSelBln: string;
  pendNama: string;
  pendTh: string;
  pendTk: string;
  pendJur: string;
  tempatLahir?: string; // Added field
  tglLahir: string;
  masaKpyad: string;
  tglSKBerkala: string;
  masaKenaikanBerkala: string;
  catatanMutasi: string;
  ket: string;
}