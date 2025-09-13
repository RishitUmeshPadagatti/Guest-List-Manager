import { guestInterface } from "@/constants/interfaces";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "data";

async function saveToSecureStore(key: string, value: any) {
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving to SecureStore:", error);
    }
}

async function getFromSecureStore<T>(key: string): Promise<T | null> {
    try {
        const result = await SecureStore.getItemAsync(key);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        console.error("Error reading from SecureStore:", error);
        return null;
    }
}


export async function getAllGuests(): Promise<guestInterface[]> {
    const guests = await getFromSecureStore<guestInterface[]>(STORAGE_KEY);
    return guests ?? [];
}

export async function addGuest(guest: guestInterface): Promise<void> {
    try {
        const guests = await getAllGuests();
        guests.push(guest);
        await saveToSecureStore(STORAGE_KEY, guests);
    } catch (error) {
        console.error("Error adding guest:", error);
    }
}

export async function deleteGuest(id: number): Promise<void> {
    try {
      const guests = await getAllGuests();
      const updatedGuests = guests.filter((guest) => guest.id !== id);
      await saveToSecureStore(STORAGE_KEY, updatedGuests);
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  }