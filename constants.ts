import { DocumentFile, RawDukData } from "./types";

export const RELIGIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
export const MARITAL_STATUS = ['Belum Kawin', 'Kawin', 'Cerai'];
export const BANKS = ['Bank Jatim', 'BRI', 'BNI', 'Mandiri', 'BCA', 'BSI'];
export const EDUCATION_LEVELS = ['SMA/SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'];
export const GOLONGAN = [
  'I/a', 'I/b', 'I/c', 'I/d',
  'II/a', 'II/b', 'II/c', 'II/d',
  'III/a', 'III/b', 'III/c', 'III/d',
  'IV/a', 'IV/b', 'IV/c', 'IV/d', 'IV/e',
  'IX', 'PPPK PW'
];

export const REQUIRED_DOCUMENTS: string[] = [
  'KTP', 'Kartu Keluarga', 'NPWP', 'Buku Nikah',
  'SK Pengangkatan', 'SK Penugasan', 'SK Pangkat Terakhir', 'Karpeg',
  'Ijazah Terakhir', 'Transkrip Nilai', 'Sertifikat Pendidik', 'NRG'
];

export const MOCK_DOCS_TEMPLATE: DocumentFile[] = REQUIRED_DOCUMENTS.map((type, idx) => ({
    id: `doc-${idx}`,
    type,
    status: 'missing'
}));

export const INITIAL_DUK_DATA: RawDukData[] = [
  { 
    id: 1, nama: "Didik Sulistyo, M.M.Pd", nip: "19660518 198901 1 002", karpeg: "-", lp: "L", 
    pangkatNama: "Pembina Utama Muda/IVc", pangkatTmt: "-", 
    jabatanNama: "Pembina Utama Muda", jabatanTmt: "1989-01-01", 
    mkGolTh: "10", mkGolBln: "6", mkSelTh: "34", mkSelBln: "3", 
    pendNama: "STMI", pendTh: "2009", pendTk: "Pasca sarjana", pendJur: "Magister Manajemen", 
    tempatLahir: "Nganjuk", tglLahir: "1966-05-18", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 2, nama: "Dra. Sri Hayati", nip: "19670628 200801 2 006", karpeg: "-", lp: "P", 
    pangkatNama: "Penata Tingkat I/IIId", pangkatTmt: "-", 
    jabatanNama: "Guru Muda", jabatanTmt: "2020-09-30", 
    mkGolTh: "5", mkGolBln: "3", mkSelTh: "22", mkSelBln: "7", 
    pendNama: "Un. Jenggala Sidoarjo", pendTh: "1992", pendTk: "Sarjana", pendJur: "Pend. Bhs & Seni", 
    tempatLahir: "Mojokerto", tglLahir: "1967-06-28", masaKpyad: "-", 
    tglSKBerkala: "2023-01-01", masaKenaikanBerkala: "", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 3, nama: "Bakhtiar Rifai, SE", nip: "19800304 200801 1 009", karpeg: "-", lp: "L", 
    pangkatNama: "Penata Tingkat I/IIId", pangkatTmt: "2020-10-01", 
    jabatanNama: "Guru Muda", jabatanTmt: "2020-09-30", 
    mkGolTh: "5", mkGolBln: "3", mkSelTh: "20", mkSelBln: "0", 
    pendNama: "STIESIA Surabaya", pendTh: "2004", pendTk: "Sarjana", pendJur: "Managemen Ekonomi", 
    tempatLahir: "Mojokerto", tglLahir: "1980-03-04", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 4, nama: "Akhmad Hariadi, S.Pd", nip: "19751108 200901 1 001", karpeg: "-", lp: "L", 
    pangkatNama: "Penata Muda Tk I, IIIb", pangkatTmt: "-", 
    jabatanNama: "Guru Madya", jabatanTmt: "2014-04-01", 
    mkGolTh: "5", mkGolBln: "3", mkSelTh: "14", mkSelBln: "0", 
    pendNama: "Univ.Barawijaya TBN", pendTh: "2007", pendTk: "Sarjana", pendJur: "Pend.Bahasa Inggris", 
    tempatLahir: "Mojokerto", tglLahir: "1975-11-08", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 5, nama: "Moch. Husain Rifai Hamzah, S.Pd", nip: "19920316 202012 1 011", karpeg: "-", lp: "L", 
    pangkatNama: "Penata Muda Tk I/IIIb", pangkatTmt: "-", 
    jabatanNama: "Guru Madya", jabatanTmt: "2025-04-01", 
    mkGolTh: "5", mkGolBln: "0", mkSelTh: "0", mkSelBln: "0", 
    pendNama: "UNESA", pendTh: "2016", pendTk: "Sarjana", pendJur: "Penjaskes", 
    tempatLahir: "Mojokerto", tglLahir: "1992-03-16", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 6, nama: "Rudi Hermawan, S.Pd.", nip: "19891029 202012 1 003", karpeg: "-", lp: "L", 
    pangkatNama: "Penata Muda Tk I/IIIb", pangkatTmt: "-", 
    jabatanNama: "Guru Madya", jabatanTmt: "2025-12-01", 
    mkGolTh: "5", mkGolBln: "0", mkSelTh: "0", mkSelBln: "0", 
    pendNama: "UPTDU Jombang", pendTh: "2013", pendTk: "Sarjana", pendJur: "Pend. Agama Islam", 
    tempatLahir: "Mojokerto", tglLahir: "1989-10-29", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 7, nama: "Okha Devi Anggraini, S.Pd", nip: "19941002 202012 2 008", karpeg: "-", lp: "P", 
    pangkatNama: "Penata Muda Tk I/IIIb", pangkatTmt: "-", 
    jabatanNama: "Guru Madya", jabatanTmt: "2025-12-01", 
    mkGolTh: "5", mkGolBln: "0", mkSelTh: "0", mkSelBln: "0", 
    pendNama: "U. Kanjuruan Malang", pendTh: "2017", pendTk: "Sarjana", pendJur: "Bimbingan Dan Konseling", 
    tempatLahir: "Mojokerto", tglLahir: "1994-10-02", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 8, nama: "Eka Hariyati, S.Pd", nip: "19731129 202421 2 003", karpeg: "-", lp: "P", 
    pangkatNama: "IX", pangkatTmt: "-", 
    jabatanNama: "Guru Ahli Pertama", jabatanTmt: "2024-03-07", 
    mkGolTh: "1", mkGolBln: "9", mkSelTh: "19", mkSelBln: "5", 
    pendNama: "IKIP PGRI Mojokerto", pendTh: "1997", pendTk: "Sarjana", pendJur: "PMP dan KN", 
    tempatLahir: "Mojokerto", tglLahir: "1973-11-29", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 9, nama: "Mikoe Wahyudi Putra, S.Pd", nip: "19820222 202421 1 004", karpeg: "-", lp: "L", 
    pangkatNama: "IX", pangkatTmt: "-", 
    jabatanNama: "Guru Ahli Pertama", jabatanTmt: "2024-03-07", 
    mkGolTh: "1", mkGolBln: "9", mkSelTh: "19", mkSelBln: "5", 
    pendNama: "Univ. Darul 'Ulum Jombang", pendTh: "2008", pendTk: "Sarjana", pendJur: "Ilmu Pendidikan", 
    tempatLahir: "Mojokerto", tglLahir: "1982-02-22", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 10, nama: "Purnadi, S.Pd", nip: "19680705 202421 1 001", karpeg: "-", lp: "L", 
    pangkatNama: "IX", pangkatTmt: "-", 
    jabatanNama: "Guru Ahli Pertama", jabatanTmt: "2024-03-01", 
    mkGolTh: "1", mkGolBln: "8", mkSelTh: "17", mkSelBln: "2", 
    pendNama: "STKIP PGRI Mojokerto", pendTh: "1998", pendTk: "Sarjana", pendJur: "Pend. Matematika", 
    tempatLahir: "Mojokerto", tglLahir: "1968-07-05", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 11, nama: "Retno Nawangwulan, S.Pd", nip: "19850703 202521 2 006", karpeg: "-", lp: "P", 
    pangkatNama: "IX", pangkatTmt: "-", 
    jabatanNama: "Guru Ahli Pertama", jabatanTmt: "2025-03-01", 
    mkGolTh: "0", mkGolBln: "10", mkSelTh: "19", mkSelBln: "5", 
    pendNama: "STIKIP PGRI Jombang", pendTh: "2010", pendTk: "Sarjana", pendJur: "Pend. Bahasa dan Seni", 
    tempatLahir: "Mojokerto", tglLahir: "1985-07-03", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 12, nama: "Israfin Maria Ulfa, S.Pd", nip: "19850131 202521 2 004", karpeg: "-", lp: "P", 
    pangkatNama: "IX", pangkatTmt: "-", 
    jabatanNama: "Guru Ahli Pertama", jabatanTmt: "2025-03-01", 
    mkGolTh: "0", mkGolBln: "10", mkSelTh: "-", mkSelBln: "-", 
    pendNama: "Univ. Negeri Malang", pendTh: "2007", pendTk: "Sarjana", pendJur: "Pendidikan Ekonomi", 
    tempatLahir: "Mojokerto", tglLahir: "1985-01-31", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 13, nama: "Emilia Kartika Sari, S.Pd", nip: "20010507 202521 2 026", karpeg: "-", lp: "P", 
    pangkatNama: "PPPK PW", pangkatTmt: "-", 
    jabatanNama: "Guru Ahli Pertama", jabatanTmt: "2025-10-01", 
    mkGolTh: "0", mkGolBln: "0", mkSelTh: "-", mkSelBln: "-", 
    pendNama: "UNMU Malang", pendTh: "2023", pendTk: "Sarjana", pendJur: "Pendidikan Matematika FKIP", 
    tempatLahir: "Mojokerto", tglLahir: "2001-05-07", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 14, nama: "Syadam Budi satrianto, S.Pd.", nip: "-", karpeg: "-", lp: "L", 
    pangkatNama: "-", pangkatTmt: "-", 
    jabatanNama: "GTT", jabatanTmt: "2020-07-08", 
    mkGolTh: "-", mkGolBln: "-", mkSelTh: "4", mkSelBln: "5", 
    pendNama: "UNESA", pendTh: "2014", pendTk: "Sarjana", pendJur: "Pend. Olah Raga", 
    tempatLahir: "Mojokerto", tglLahir: "1991-01-25", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 15, nama: "Rebby Dwi Prataopu, S.Si", nip: "-", karpeg: "-", lp: "P", 
    pangkatNama: "-", pangkatTmt: "-", 
    jabatanNama: "GTT", jabatanTmt: "2023-07-17", 
    mkGolTh: "-", mkGolBln: "-", mkSelTh: "2", mkSelBln: "5", 
    pendNama: "UNESA", pendTh: "2013", pendTk: "Sarjana", pendJur: "Fisika", 
    tempatLahir: "Subang", tglLahir: "1987-10-28", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 16, nama: "Mukhamad Yunus, S.Pd", nip: "-", karpeg: "-", lp: "L", 
    pangkatNama: "-", pangkatTmt: "-", 
    jabatanNama: "GTT", jabatanTmt: "2025-08-07", 
    mkGolTh: "-", mkGolBln: "-", mkSelTh: "0", mkSelBln: "4", 
    pendNama: "UNESA", pendTh: "2011", pendTk: "Sarjana", pendJur: "Pend. IPA", 
    tempatLahir: "Bojonegoro", tglLahir: "1989-01-31", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 17, nama: "Fahmi Wahyuni, S.Pd", nip: "-", karpeg: "-", lp: "P", 
    pangkatNama: "-", pangkatTmt: "-", 
    jabatanNama: "GTT", jabatanTmt: "2025-08-07", 
    mkGolTh: "-", mkGolBln: "-", mkSelTh: "0", mkSelBln: "4", 
    pendNama: "UNIDHA Malang", pendTh: "2013", pendTk: "Sarjana", pendJur: "Pend. Bahasa dan Sastra Indonesia", 
    tempatLahir: "Mojokerto", tglLahir: "1991-01-22", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 18, nama: "Fakhita Madury, S.Sn.", nip: "-", karpeg: "-", lp: "P", 
    pangkatNama: "-", pangkatTmt: "-", 
    jabatanNama: "GTT", jabatanTmt: "2025-08-07", 
    mkGolTh: "-", mkGolBln: "-", mkSelTh: "0", mkSelBln: "4", 
    pendNama: "STKW Surabaya", pendTh: "2020", pendTk: "Sarjana", pendJur: "Seni Rupa Murni", 
    tempatLahir: "Sumenep", tglLahir: "1998-06-14", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 19, nama: "Imam Safi'i", nip: "19790421 202521 1 055", karpeg: "-", lp: "L", 
    pangkatNama: "PPPK PW", pangkatTmt: "-", 
    jabatanNama: "Operator Layanan Operasional", jabatanTmt: "2025-10-01", 
    mkGolTh: "0", mkGolBln: "0", mkSelTh: "19", mkSelBln: "5", 
    pendNama: "MAN Mojosari", pendTh: "1998", pendTk: "SMA", pendJur: "IPS", 
    tempatLahir: "Mojokerto", tglLahir: "1979-04-21", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 20, nama: "Mansyur Rokhmad", nip: "19811101 202521 1 057", karpeg: "-", lp: "L", 
    pangkatNama: "PPPK PW", pangkatTmt: "-", 
    jabatanNama: "Operator Layanan Operasional", jabatanTmt: "2025-10-01", 
    mkGolTh: "0", mkGolBln: "0", mkSelTh: "19", mkSelBln: "5", 
    pendNama: "STM KITA BHAKTI", pendTh: "2000", pendTk: "STM", pendJur: "Mekanik Umum", 
    tempatLahir: "Mojokerto", tglLahir: "1981-11-01", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 21, nama: "Rayi Putri Lestari, S.Pd.", nip: "19900209 202521 2 112", karpeg: "-", lp: "P", 
    pangkatNama: "PPPK PW", pangkatTmt: "-", 
    jabatanNama: "Operator Layanan Operasional", jabatanTmt: "2025-10-01", 
    mkGolTh: "0", mkGolBln: "0", mkSelTh: "2", mkSelBln: "5", 
    pendNama: "Universitas Terbuka", pendTh: "2014", pendTk: "Sarjana", pendJur: "PGSD", 
    tempatLahir: "Sidoarjo", tglLahir: "1990-02-09", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
  { 
    id: 22, nama: "Mochamad Ansori", nip: "19840516 202521 1 005", karpeg: "-", lp: "L", 
    pangkatNama: "PPPK PW", pangkatTmt: "-", 
    jabatanNama: "Operator Layanan Operasional", jabatanTmt: "2025-10-01", 
    mkGolTh: "0", mkGolBln: "0", mkSelTh: "8", mkSelBln: "0", 
    pendNama: "SMK Dharma Bhakti", pendTh: "2004", pendTk: "SMK", pendJur: "Teknik Mesin", 
    tempatLahir: "Surabaya", tglLahir: "1984-05-16", masaKpyad: "-", 
    tglSKBerkala: "", masaKenaikanBerkala: "-", 
    catatanMutasi: "-", ket: "" 
  },
];