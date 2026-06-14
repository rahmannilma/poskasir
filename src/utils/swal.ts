import Swal from 'sweetalert2';

// Create a pre-styled Swal instance matching the M-Coffee Emerald theme
export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonColor: '#246b00',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-2xl font-sans text-xs border border-outline-variant/30',
      title: 'text-on-surface font-bold text-sm',
      htmlContainer: 'text-xs text-on-surface-variant',
      confirmButton: 'px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer outline-none',
    }
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonColor: '#dc2626',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-2xl font-sans text-xs border border-outline-variant/30',
      title: 'text-on-surface font-bold text-sm',
      htmlContainer: 'text-xs text-on-surface-variant',
      confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer outline-none',
    }
  });
};

export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    confirmButtonColor: '#d97706',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-2xl font-sans text-xs border border-outline-variant/30',
      title: 'text-on-surface font-bold text-sm',
      htmlContainer: 'text-xs text-on-surface-variant',
      confirmButton: 'px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer outline-none',
    }
  });
};

export const showConfirmDialog = (title: string, text: string, confirmText: string = 'Ya, Lanjutkan') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#246b00',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-2xl font-sans text-xs border border-outline-variant/30',
      title: 'text-on-surface font-bold text-sm',
      htmlContainer: 'text-xs text-on-surface-variant',
      confirmButton: 'px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider mx-1 cursor-pointer outline-none',
      cancelButton: 'px-4 py-2 bg-gray-500 text-white rounded-xl text-xs font-medium uppercase tracking-wider mx-1 cursor-pointer outline-none',
    }
  });
};
