// context creation to use useContext Hook
import { createContext } from "react";

// context to fill for filling of Image Template of a particular item using its data
export const ItemDataContext = createContext();
// context to pass item data to modal window and show/hide that modal
export const ModalContext = createContext();
