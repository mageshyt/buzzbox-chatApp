import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type: ModalType) => {
    set({ type, isOpen: true });
  },
  onClose: () => {
    set({ type: null, isOpen: false });
  },
}));
