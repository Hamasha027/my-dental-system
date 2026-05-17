import webpush from 'web-push'
import { db } from '@/db/drizzle'
import { pushSubscriptionsTable, usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

// VAPID keys setup
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!

webpush.setVapidDetails(
  'mailto:admin@dental-system.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

/**
 * نێردنی Web Push Notification بۆ هەموو ئەدمینەکان
 */
export async function sendPushToAdmins(payload: {
  title: string
  body: string
  icon?: string
  tag?: string
  url?: string
}) {
  try {
    // هەموو ئەدمینەکان بدۆزەرەوە
    const admins = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.role, 'admin'))

    const adminIds = admins.map((a) => a.id)
    if (adminIds.length === 0) return

    // هەموو push subscriptions ی ئەدمینەکان بهێنە
    const subscriptions = await db
      .select()
      .from(pushSubscriptionsTable)

    // تەنها ئەوانەی کە بۆ ئەدمینن فلتەر بکە
    const adminSubscriptions = subscriptions.filter((sub) =>
      adminIds.includes(sub.userId)
    )

    if (adminSubscriptions.length === 0) return

    const pushPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon/icon.png',
      tag: payload.tag || 'admin-login-' + Date.now(),
      url: payload.url || '/dashboard',
    })

    // نێردنی push بۆ هەموو subscription ەکان
    const results = await Promise.allSettled(
      adminSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            pushPayload
          )
        } catch (error: unknown) {
          // ئەگەر subscription بەسەرچوو (410 Gone یان 404)، بیسڕەوە
          if (
            error &&
            typeof error === 'object' &&
            'statusCode' in error &&
            ((error as { statusCode: number }).statusCode === 410 ||
              (error as { statusCode: number }).statusCode === 404)
          ) {
            await db
              .delete(pushSubscriptionsTable)
              .where(eq(pushSubscriptionsTable.id, sub.id))
          }
          throw error
        }
      })
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length
    if (failed > 0) {
      console.warn(`Push notifications: ${succeeded} sent, ${failed} failed`)
    }
  } catch (error) {
    console.error('sendPushToAdmins error:', error)
  }
}
