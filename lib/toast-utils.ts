"use client";

import { toast as sonnerToast } from "sonner";

/**
 * Toast notification utilities
 * Replaces native alert/confirm with beautiful toast notifications
 *
 * 注意: Toast使用z-index 9999，低于Dialog的z-index 100
 * 这样在有Dialog显示时，Toast不会遮挡Dialog
 */

export function showSuccess(message: string, description?: string) {
  sonnerToast.success(message, {
    description,
    duration: 3000,
    // 设置Toast的位置和样式，确保不遮挡重要弹窗
    position: "top-center",
    className: "z-[9999]",
  });
}

export function showError(message: string, description?: string) {
  sonnerToast.error(message, {
    description,
    duration: 5000,
    position: "top-center",
    className: "z-[9999]",
  });
}

export function showInfo(message: string, description?: string) {
  sonnerToast.info(message, {
    description,
    duration: 4000,
    position: "top-center",
    className: "z-[9999]",
  });
}

export function showWarning(message: string, description?: string) {
  sonnerToast.warning(message, {
    description,
    duration: 4000,
    position: "top-center",
    className: "z-[9999]",
  });
}

/**
 * Custom confirm dialog using toast with actions
 * Returns a promise that resolves to boolean
 */
export function showConfirm(
  message: string,
  options: {
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } = {}
): Promise<boolean> {
  const {
    description,
    confirmText = "确认",
    cancelText = "取消",
    onConfirm,
    onCancel,
  } = options;

  return new Promise((resolve) => {
    sonnerToast(message, {
      description,
      duration: 10000,
      action: {
        label: confirmText,
        onClick: () => {
          onConfirm?.();
          resolve(true);
        },
      },
      cancel: {
        label: cancelText,
        onClick: () => {
          onCancel?.();
          resolve(false);
        },
      },
    });
  });
}

// Default export for convenience
export { sonnerToast as toast };
