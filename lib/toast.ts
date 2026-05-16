import { toast as sonnerToast, type ExternalToast } from 'sonner'

type ToastOptions = ExternalToast

/** هەموو ئەلێرتەکان بە هەمان دیزاینی تیل (#3dc1d3) */
function show(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, options)
}

export const toast = {
  show,
  success: show,
  error: show,
  info: show,
  warning: show,
}
