import { useEffect, useState } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmar Cancelamento",
  description = "Deseja mesmo cancelar o pedido? Esta ação devolverá os itens ao estoque e não poderá ser desfeita.",
  confirmText = "Sim, cancelar",
  cancelText = "Manter pedido",
}: ConfirmationModalProps) {
  const [showRender, setShowRender] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowRender(true);
      // Small timeout to allow CSS transition to process the state change
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShowRender(false), 300); // 300ms transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animateIn ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={onCancel}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transition-all duration-300 transform ${
          animateIn ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        style={{
          backgroundColor: "var(--bg-card, #ffffff)",
          color: "var(--text-dark, #111827)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted, #6b7280)" }}>
          {description}
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-hover, #f3f4f6)",
              color: "var(--text-dark, #374151)"
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
