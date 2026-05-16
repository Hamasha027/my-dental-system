import { useNotifications } from '@/contexts/notifications-context'
import { formatMoney } from '@/lib/notification-utils'
import { playNotificationSound } from '@/lib/notification-sound'

/**
 * هوک بۆ نۆتیفیکەیشن بە کوردی — لە فرۆشتن و نەخۆش و ئەوانی تر بەکاربهێنە
 */
export function useNotificationHelper() {
  const { addNotification } = useNotifications()

  return {
    notifySale: (productName: string, amount: number, quantity = 1) => {
      const total = amount * quantity
      playNotificationSound('sale')
      addNotification({
        type: 'sale',
        title: 'فرۆشتی نوێ',
        message: `کاڵای «${productName}» — ${formatMoney(total)} تۆمارکرا`,
      })
    },

    notifyPatient: (patientName: string, treatmentType?: string) => {
      const detail = treatmentType ? ` · چارەسەر: ${treatmentType}` : ''
      playNotificationSound('patient')
      addNotification({
        type: 'patient',
        title: 'نەخۆشی نوێ',
        message: `نەخۆشی «${patientName}» بە سەرکەوتوویی تۆمارکرا${detail}`,
      })
    },

    notifySaleDeleted: (productName: string, total?: number) => {
      const amount =
        total != null && total > 0 ? ` — ${formatMoney(total)}` : ''
      playNotificationSound('sale')
      addNotification({
        type: 'sale_delete',
        title: 'فرۆشتن سڕایەوە',
        message: `کاڵای «${productName}»${amount} لە تۆمارەوە سڕایەوە`,
      })
    },

    notifyPatientDeleted: (patientName: string) => {
      playNotificationSound('patient')
      addNotification({
        type: 'patient_delete',
        title: 'نەخۆش سڕایەوە',
        message: `نەخۆشی «${patientName}» لە تۆمارەوە سڕایەوە`,
      })
    },

    notifyStaff: (staffName: string, action = 'کارمەندی نوێ زیادکرا') => {
      addNotification({
        type: 'staff',
        title: 'کارمەند',
        message: `${action}: ${staffName}`,
      })
    },

    notifyAppointment: (patientName: string, date: string) => {
      addNotification({
        type: 'appointment',
        title: 'چاوپێکەوتنی نوێ',
        message: `چاوپێکەوتن بۆ «${patientName}» لە ${date}`,
      })
    },

    notifySuccess: (title: string, message: string) => {
      addNotification({
        type: 'success',
        title,
        message,
      })
    },

    notifyError: (title: string, message: string) => {
      addNotification({
        type: 'error',
        title,
        message,
      })
    },

    notifyInfo: (title: string, message: string) => {
      addNotification({
        type: 'info',
        title,
        message,
      })
    },
  }
}
