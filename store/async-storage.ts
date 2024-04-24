import { StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    const jsonValue = JSON.stringify(value);
    return await AsyncStorage.setItem(name, jsonValue);
  },
  getItem: async (name) => {
    const jsonValue = await AsyncStorage.getItem(name);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  },
  removeItem: async (name) => {
    return await AsyncStorage.removeItem(name);
  },
};
