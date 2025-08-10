import { useState } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  word: string;
  definition: string;
  setWord: (value: string) => void;
  setDefinition: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UpdateConfirmModal({
  isOpen,
  title,
  description,
  word,
  definition,
  setWord,
  setDefinition,
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-black/90 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title || "Confirm"}</h3>
        <p className="mb-6">{description || "Are you sure?"}</p>
        <div className="flex flex-col gap-3 my-3">
          <Input
            id="word"
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter the word you want to learn..."
            className="h-12 text-lg bg-input/50 border-border focus:border-primary transition-colors"
          />
          <Textarea
            id="definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Enter the definition or explanation..."
            className="min-h-32 text-md bg-input/50 border-border focus:border-primary transition-colors resize-none"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
