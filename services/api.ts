import { Employee, DocumentDefinition } from '../types';

// GANTI URL INI DENGAN URL DEPLOYMENT GOOGLE APPS SCRIPT ANDA YANG BARU
// (Ikuti instruksi di bawah chat untuk membuat Backend)
const API_URL = "https://script.google.com/macros/s/AKfycbww_1nZUgwexm6FnTe4T0AsXWOWW50GptRtJ2pF8AQV55XJ4dKLY6rJ9lavH5HDjZ0C/exec"; 

export const api = {
  fetchAll: async () => {
    try {
      // Menggunakan no-cors atau text/plain untuk menghindari preflight check yang ketat dari Google
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify({ action: 'GET_ALL_DATA' })
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  },

  saveEmployee: async (data: Employee) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ 
            action: 'SAVE_EMPLOYEE',
            data: data
        })
      });
      return true;
    } catch (error) {
      console.error("Error saving employee:", error);
      return false;
    }
  },

  deleteEmployee: async (id: string) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ 
            action: 'DELETE_EMPLOYEE',
            id: id
        })
      });
      return true;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return false;
    }
  },

  saveDefinitions: async (defs: DocumentDefinition[]) => {
      try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({ 
                action: 'SAVE_DEFINITIONS',
                data: defs
            })
        });
        return true;
      } catch (error) {
          console.error("Error saving settings:", error);
          return false;
      }
  },
  
  // Fungsi untuk inisialisasi data awal ke server jika server kosong
  seedInitialData: async (employees: Employee[]) => {
      try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({ 
                action: 'SEED_DATA',
                data: employees
            })
        });
        return true;
      } catch (error) {
          console.error("Error seeding data:", error);
          return false;
      }
  }
};