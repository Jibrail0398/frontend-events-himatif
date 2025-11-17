// stores/useFormPresensiStore.js
import { create } from 'zustand';

const useFormPresensiStore = create((set, get) => ({
  // State
  records: [],
  
  // Pastikan todayRecords mengembalikan array kosong jika tidak ada data
  todayRecords: [],
  
  // Actions
  checkIn: (data) => {
    // Implementasi checkIn
    const newRecord = { ...data, id: Date.now() };
    set((state) => ({
      records: [...state.records, newRecord],
      todayRecords: [...state.todayRecords, newRecord] // Pastikan ini ada
    }));
    return true;
  },
  
  checkOut: (data) => {
    // Implementasi checkOut
    const newRecord = { ...data, id: Date.now() };
    set((state) => ({
      records: [...state.records, newRecord],
      todayRecords: [...state.todayRecords, newRecord] // Pastikan ini ada
    }));
    return true;
  },
  
  getTodayStats: () => {
    const { todayRecords } = get();
    // Pastikan todayRecords selalu berupa array
    const records = todayRecords || [];
    const totalCheckedIn = records.filter(r => r.type === 'checkin').length;
    const totalCheckedOut = records.filter(r => r.type === 'checkout').length;
    
    return { totalCheckedIn, totalCheckedOut };
  }
}));

export default useFormPresensiStore;