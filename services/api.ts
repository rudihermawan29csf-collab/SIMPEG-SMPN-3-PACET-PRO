import { Employee, DocumentDefinition, User } from '../types';

// GANTI URL INI DENGAN URL DEPLOYMENT APPS SCRIPT ANDA
const API_URL = "https://script.google.com/macros/s/AKfycbxVftSgEpygQ7oq4vNFj605SO5C_s3LWg6yfALE2HaMj02JKESDE8KH2MKXzjYiHCTkcg/exec"; 

export const api = {
  fetchAll: async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'GET_ALL_DATA' })
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  },

  saveEmployee: async (data: Employee) => {
    try {
      // Convert dates to string/ISO if needed before sending
      await fetch(API_URL, {
        method: 'POST',
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
  }
};