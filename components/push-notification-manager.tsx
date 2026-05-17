'use client'

import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/contexts/user-context'
import { isPushSupported, subscribeToPush, isSubscribedToPush } from '@/lib/push-subscribe'
import { Bell, BellRing } from 'lucide-react'

/**
 * کۆمپۆنێنتی بەڕێوبردنی Push Notification بۆ ئەدمین
 * کاتێک ئەدمین بۆ یەکەم جار دەچێتە ژوورەوە، داوای ئیزنی نۆتیفیکەیشن دەکات
 */
export function PushNotificationManager() {
  const { user, loading } = useUser()
  const hasAttempted = useRef(false)
  const [showBanner, setShowBanner] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (loading || !user?.isAdmin) return
    if (hasAttempted.current) return
    hasAttempted.current = true

    // بپشکنە ئایا push پشتگیری دەکرێت
    if (!isPushSupported()) return

    const checkAndSubscribe = async () => {
      const alreadySubscribed = await isSubscribedToPush()
      if (alreadySubscribed) {
        setIsSubscribed(true)
        // هەر subscription ەکە نوێ بکەرەوە بۆ سێرڤەر
        await subscribeToPush()
        return
      }

      // ئەگەر هێشتا subscribe نەکراوە، بانەرەکە پیشان بدە
      const permission = Notification.permission
      if (permission === 'default') {
        setShowBanner(true)
      } else if (permission === 'granted') {
        // ئیزن هەیە بەڵام subscribe نەکراوە
        const success = await subscribeToPush()
        setIsSubscribed(success)
      }
    }

    // بۆ ئەوەی لەگەڵ rendering کێشە نەبێت
    const timer = setTimeout(checkAndSubscribe, 2000)
    return () => clearTimeout(timer)
  }, [loading, user?.isAdmin])

  const handleEnable = async () => {
    const success = await subscribeToPush()
    setIsSubscribed(success)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
  }

  // تەنها بۆ ئەدمین پیشان بدە
  if (!user?.isAdmin) return null

  // بانەری داواکردنی ئیزن
  if (showBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-4 border border-white/10">
          <div className="flex items-start gap-3" dir="rtl">
            <div className="bg-white/20 rounded-xl p-2.5 shrink-0">
              <BellRing className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm mb-1">نۆتیفیکەیشنی Push چالاک بکە</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                ئاگاداری دەکرێیتەوە کاتێک یوزەرێک دەچێتە ژوورەوە — تەنانەت ئەگەر براوزەر داخرابێت
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleEnable}
                  className="bg-white text-blue-600 font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  چالاک بکە ✓
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-white/70 text-xs px-3 py-2 hover:text-white transition-colors"
                >
                  دواتر
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
