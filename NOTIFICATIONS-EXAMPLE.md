/**
 * مثال عملي لدمج الإشعارات في صفحة البيع
 * 
 * هذا الملف يوضح بالضبط أين تضيف استخدام الإشعارات في seller/page.tsx
 */

// ============================================
// 1. أضف الاستيراد في الأعلى:
// ============================================

import { useNotificationHelper } from '@/hooks/useNotificationHelper'

// ============================================
// 2. داخل المكون (Component)
// ============================================

export default function SellerPage() {
  // أضف هذا السطر مع باقي التعريفات:
  const { notifySale, notifySuccess, notifyError } = useNotificationHelper()

  // الباقي من الكود يبقى كما هو...

  // ============================================
  // 3. عند الحفظ (حوالي سطر 273-288)
  // ============================================

  // البحث عن هذا الكود:
  /*
  } else {
    response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData),
    });
  }

  if (!response.ok) {
    throw new Error('هەڵە لە تۆمارکردنی فرۆشتن');
  }

  await fetchSales(searchQuery);
  toast.success(editingSale ? 'فرۆشتن بە سەرکەوتوویی نوێکرایەوە' : 'فرۆشتن بە سەرکەوتوویی تۆمارکرا');
  */

  // وأضف بعده هذا:
  /*
  // إضافة إشعار البيع
  notifySale(saleData.productName, saleData.price * saleData.quantity)
  */

  // ============================================
  // 4. في معالج الخطأ
  // ============================================

  // البحث عن:
  /*
  } catch (error) {
    console.error('Error saving sale:', error);
    toast.error('هەڵە لە تۆمارکردنی فرۆشتن');
  }
  */

  // وأضف قبل catch:
  /*
  } catch (error) {
    console.error('Error saving sale:', error);
    notifyError('خطأ', 'فشل حفظ البيع')
    toast.error('هەڵە لە تۆمارکردنی فرۆشتن');
  }
  */

  // ============================================
  // 5. عند الحذف (حوالي سطر 290-305)
  // ============================================

  /*
  await fetchSales(searchQuery);
  toast.success('فرۆشتن بە سەرکەوتوویی سڕایەوە');
  */

  // أضف:
  /*
  notifySuccess('حذف ناجح', 'تم حذف البيع بنجاح')
  */

  // ============================================
  // الكود الكامل للدالة handleSave
  // ============================================

  const exampleHandleSave = async () => {
    // ... كود موجود

    try {
      const saleData = {
        productName: 'فرشة أسنان',
        category: 'tools',
        price: 25000,
        quantity: 2,
        date: '2026-05-16',
        notes: '',
      };

      let response;
      response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw new Error('هەڵە لە تۆمارکردنی فرۆشتن');
      }

      // ✅ أضف هذا السطر:
      notifySale(saleData.productName, saleData.price * saleData.quantity)

      await fetchSales(searchQuery);
      // يمكنك حذف أو الاحتفاظ بـ toast
      toast.success('فرۆشتن بە سەرکەوتوویی تۆمارکرا');
    } catch (error) {
      console.error('Error saving sale:', error);
      // ✅ أضف هذا السطر:
      notifyError('خطأ في البيع', 'فشل حفظ البيع. حاول مرة أخرى.')
      toast.error('هەڵە لە تۆمارکردنی فرۆشتن');
    }
  };

  // ============================================
  // الكود الكامل لدالة الحذف
  // ============================================

  const exampleHandleConfirmDelete = async () => {
    if (deletingSale) {
      try {
        const response = await fetch(`/api/sales?id=${deletingSale.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('هەڵە لە سڕینەوەی فرۆشتن');
        }

        await fetchSales(searchQuery);
        // ✅ أضف هذا السطر:
        notifySuccess('حذف ناجح', `تم حذف ${deletingSale.productName} بنجاح`)

        toast.success('فرۆشتن بە سەرکەوتوویی سڕایەوە');
        setIsDeleteDialogOpen(false);
        setDeletingSale(null);
      } catch (error) {
        console.error('Error deleting sale:', error);
        // ✅ أضف هذا السطر:
        notifyError('خطأ', 'فشل حذف البيع')
        toast.error('هەڵە لە سڕینەوەی فرۆشتن');
      }
    }
  };
}

// ============================================
// ملخص التعديلات
// ============================================

/*
1. استيراد الـ Hook في الأعلى:
   import { useNotificationHelper } from '@/hooks/useNotificationHelper'

2. استدعاء الـ Hook:
   const { notifySale, notifySuccess, notifyError } = useNotificationHelper()

3. إضافة إشعار عند الحفظ الناجح:
   notifySale(saleData.productName, saleData.price * saleData.quantity)

4. إضافة إشعار عند الخطأ:
   notifyError('خطأ في البيع', 'فشل حفظ البيع')

5. إضافة إشعار عند الحذف:
   notifySuccess('حذف ناجح', `تم حذف البيع بنجاح`)

ذلك كل شيء! 🎉
*/
