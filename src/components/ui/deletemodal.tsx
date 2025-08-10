interface ModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-black/90 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title || "Confirm"}</h3>
        <p className="mb-6">{description || "Are you sure?"}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
