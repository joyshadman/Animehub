import { create } from "zustand";

const initialTopTen = {
  today: [],
  week: [],
  month: [],
};

const useTopTenStore = create((set) => ({
  topTen: initialTopTen,
  setTopTen: (value) =>
    set({
      topTen: value ?? initialTopTen,
    }),
}));

export default useTopTenStore;
