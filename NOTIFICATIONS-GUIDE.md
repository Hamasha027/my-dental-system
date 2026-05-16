# 🔔 نظام الإشعارات - دليل الاستخدام

## نظرة عامة

تم إضافة نظام إشعارات حديث إلى لوحة التحكم. يعرض الإشعارات بجانب زر تبديل الوضع الفاتح/الغامق في رأس الصفحة.

## المميزات

✅ **إشعارات فورية** - تظهر فوراً عند حدوث أي حدث
✅ **فئات متنوعة** - بيع، مريض، موظف، موعد، إلخ
✅ **تصميم جميل** - رموز ملونة وتصميم أنيق
✅ **حفظ تاريخ** - آخر 50 إشعار
✅ **إزالة تلقائية** - تختفي بعد 5 ثوان

---

## الاستخدام

### 1. استيراد الـ Hook

```javascript
import { useNotificationHelper } from '@/hooks/useNotificationHelper'
```

### 2. استخدام في الصفحة

```javascript
export default function MyPage() {
  const { notifySale, notifyPatient, notifySuccess } = useNotificationHelper()

  // استخدام عند حفظ بيع
  const handleSale = async () => {
    try {
      // ... كود الحفظ
      notifySale('اسم المنتج', 50000)
    } catch (error) {
      notifyError('خطأ', 'فشل حفظ البيع')
    }
  }

  return (
    // ... الصفحة
  )
}
```

---

## أنواع الإشعارات

### 1. إشعار البيع
```javascript
notifySale(productName, amount)
// مثال:
notifySale('فرشة أسنان', 25000)
```
**الرمز:** 🛒 | **اللون:** أخضر

### 2. إشعار المريض
```javascript
notifyPatient(patientName)
// مثال:
notifyPatient('أحمد محمد')
```
**الرمز:** 👥 | **اللون:** أزرق

### 3. إشعار الموظف
```javascript
notifyStaff(staffName, action)
// مثال:
notifyStaff('فاطمة علي', 'تم إضافة موظف جديد')
```
**الرمز:** 👤 | **اللون:** بنفسجي

### 4. إشعار الموعد
```javascript
notifyAppointment(patientName, date)
// مثال:
notifyAppointment('محمد أحمد', '2026-05-20')
```
**الرمز:** 📅 | **اللون:** برتقالي

### 5. إشعار النجاح
```javascript
notifySuccess(title, message)
// مثال:
notifySuccess('تمام!', 'تم حفظ البيانات بنجاح')
```
**الرمز:** ✅ | **اللون:** أخضر

### 6. إشعار الخطأ
```javascript
notifyError(title, message)
// مثال:
notifyError('خطأ!', 'فشل الاتصال بقاعدة البيانات')
```
**الرمز:** ❌ | **اللون:** أحمر

### 7. إشعار معلومات
```javascript
notifyInfo(title, message)
// مثال:
notifyInfo('تنبيه', 'تم تحديث البيانات')
```
**الرمز:** ℹ️ | **اللون:** رمادي

---

## الاستخدام في صفحة البيع (Seller Page)

### قبل التعديل:
```javascript
toast.success('فرۆشتن بە سەرکەوتوویی تۆمارکرا')
```

### بعد التعديل:
```javascript
import { useNotificationHelper } from '@/hooks/useNotificationHelper'

export default function SellerPage() {
  const { notifySale } = useNotificationHelper()

  const handleSave = async () => {
    // ... كود الحفظ
    notifySale(formData.productName, saleData.price * saleData.quantity)
  }
}
```

---

## واجهة الاستخدام

### الزر في الرأس:
```
[🔔] - زر الإشعارات بجانب زر تبديل الوضع
       ↓
    عند الضغط يظهر قائمة الإشعارات
    ↓
- آخر 50 إشعار
- عدد الإشعارات غير المقروءة
- خيار حذف الكل
```

---

## الخصائص المتقدمة

### الحد الأقصى للإشعارات:
- الحد الأقصى: **50 إشعار**
- الحذف التلقائي: **5 ثوان**

### الوقت:
```
الآن ← 0 ثانية
منذ 5 دقائق ← 5 دقائق
منذ 2 ساعة ← ساعة واحدة أو أكثر
التاريخ ← أكثر من 24 ساعة
```

---

## أمثلة عملية

### مثال 1: إضافة بيع
```javascript
const handleSale = async (productName, price, quantity) => {
  try {
    const response = await fetch('/api/sales', {
      method: 'POST',
      body: JSON.stringify({ productName, price, quantity })
    })
    
    notifySale(productName, price * quantity)
  } catch (error) {
    notifyError('خطأ', 'فشل حفظ البيع')
  }
}
```

### مثال 2: إضافة موظف
```javascript
const handleAddStaff = async (staffData) => {
  try {
    const response = await fetch('/api/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    })
    
    notifyStaff(staffData.fullName, 'تم إضافة موظف جديد')
  } catch (error) {
    notifyError('خطأ', 'فشل إضافة الموظف')
  }
}
```

### مثال 3: تحديث موعد
```javascript
const handleUpdateAppointment = async (patientName, date) => {
  try {
    const response = await fetch('/api/appointments', {
      method: 'PUT',
      body: JSON.stringify({ patientName, date })
    })
    
    notifyAppointment(patientName, new Date(date).toLocaleDateString('ku-IQ'))
  } catch (error) {
    notifyError('خطأ', 'فشل تحديث الموعد')
  }
}
```

---

## الملفات المتعلقة

| الملف | الوصف |
|------|--------|
| `contexts/notifications-context.tsx` | سياق الإشعارات الرئيسي |
| `components/notification-bell.tsx` | مكون جرس الإشعارات |
| `hooks/useNotificationHelper.ts` | Hook مساعد للاستخدام السهل |
| `app/providers.tsx` | موفر الإشعارات (Provider) |

---

## نصائح

1. **استخدم الأنواع المناسبة**: اختر نوع الإشعار المناسب لكل حدث
2. **رسائل واضحة**: اكتب رسائل واضحة وموجزة
3. **لا تبالغ**: لا تضيف إشعارات لكل شيء، استخدمها للأحداث المهمة فقط
4. **التعريب**: استخدم النصوص بالكردية/العربية

---

**تم! الآن أنت جاهز لاستخدام نظام الإشعارات! 🎉**
