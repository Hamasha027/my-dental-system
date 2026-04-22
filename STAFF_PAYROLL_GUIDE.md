# Staff & Payroll Management System

## Overview
A professional, RTL-enabled Staff & Payroll Management page for a dental clinic system built with React, Next.js, TypeScript, Tailwind CSS, Shadcn UI, and Drizzle ORM with Neon PostgreSQL.

## Features

### 1. **Database Schema** (Neon/PostgreSQL)

#### Staff Table (`staff_table`)
```sql
{
  id: int (Primary Key),
  fullName: text (Required),
  role: text (Required),
  phonenumber: varchar(20) (Required),
  basicSalary: numeric(12,2),
  age: int (Optional),
  address: text (Optional),
  status: varchar(20) = 'Active' | 'Inactive',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Transactions Table (`transactions_table`)
```sql
{
  id: int (Primary Key),
  staffId: int (Foreign Key → staff_table.id),
  amount: numeric(12,2) (Required),
  type: varchar(50) = 'Advance' | 'Salary' (Required),
  date: timestamp,
  note: text (Optional),
  createdAt: timestamp
}
```

### 2. **Frontend Components**

#### Main Page Layout
- **RTL Support**: Full right-to-left (RTL) layout for Kurdish Sorani (`dir="rtl"`)
- **Responsive Design**: Mobile-first, adapts to all screen sizes
- **Dark Mode**: Full dark mode support using Tailwind CSS

#### Components Used:
- **Shadcn/UI Table**: Professional data table with pagination
- **Shadcn/UI Dialog**: Modal for adding staff and advances
- **Shadcn/UI Input**: Form inputs
- **Shadcn/UI Select**: Dropdown selection
- **Shadcn/UI Badge**: Status indicators
- **Shadcn/UI Card**: Statistics cards
- **Lucide Icons**: Professional icons throughout

#### Statistics Cards
1. **Total Staff Count**: Number of all employees
2. **Active Staff**: Count of active employees
3. **Total Salary**: Sum of all basic salaries

### 3. **Main Table Features**

#### Table Headers (Kurdish Sorani):
| Column | Kurdish Label |
|--------|---------------|
| Staff Name | ناوی کارمەند |
| Job Role | پلەی وەزیفی |
| Phone Number | ژمارە تێلیفۆن |
| Basic Salary | مووچەی بنەڕەتی |
| Monthly Advances | کۆی پێشەکییەکان |
| Remaining Salary | بڕی ماوەی مووچە |
| Status | بارودۆخ |
| Actions | کردارەکان |

#### Calculations:
- **Monthly Advances Total**: Sum of all "Advance" transactions for current month
- **Remaining Salary**: `basicSalary - monthlyAdvances`
- **Status Indicator**: 
  - Green badge for "Active" (چالاک)
  - Gray badge for "Inactive" (ناچالاک)
- **Remaining Salary Color**:
  - Green text if positive
  - Red text if negative/exceeded

### 4. **Dialogs & Modals**

#### A. Add Staff Dialog
**Label**: "زیادکردنی کارمەند نوێ" (Add New Staff)

**Form Fields**:
- Full Name (ناوی تێدا) - Required
- Job Role (پلەی وەزیفی) - Required
- Phone Number (ژمارە تێلیفۆن) - Required
- Basic Salary (مووچەی بنەڕەتی)
- Age (تێمە)
- Address (ناونیشان)
- Status (بارودۆخ) - Active/Inactive dropdown

#### B. Add Advance Dialog
**Label**: "تۆمارکردنی پێشەکی" (Record Advance)

**Form Fields**:
- Staff Member (کارمەند) - Required, dropdown with all staff
- Amount (بڕی پارە) - Required, numeric
- Note (تێبینی) - Optional text field

### 5. **Search & Filter**
- Real-time search by:
  - Staff name (ناو)
  - Job role (پلە)
  - Phone number (ژمارە)
- Search placeholder: "بگەڕێ بە ناو، پلە یان ژمارە..."

### 6. **Actions**

#### Staff Actions:
- **Delete Staff**: Remove a staff member from the system
- Each row has a delete button (trash icon) with confirmation

#### Global Actions:
- **Add Staff Button**: Opens add staff dialog (Blue, top right)
- **Record Advance Button**: Opens add advance dialog (Amber, top right)

## API Endpoints

### Staff API (`/api/staff`)
```
GET /api/staff
- Fetch all staff members
- Returns: Staff[]

POST /api/staff
- Create new staff
- Body: { fullName, role, phonenumber, basicSalary?, age?, address?, status? }
- Returns: { message, staff }

DELETE /api/staff?id={staffId}
- Delete staff member
- Returns: { message }
```

### Transactions API (`/api/transactions`)
```
GET /api/transactions?staffId={id}&type={type}
- Fetch transactions (optional filters)
- Returns: Transaction[]

POST /api/transactions
- Create new transaction
- Body: { staffId, amount, type, note? }
- Returns: { message, transaction }

DELETE /api/transactions?id={id}
- Delete transaction
- Returns: { message }
```

## Usage Example

### 1. Add a New Staff Member
1. Click "زیادکردنی کارمەند" (Add Staff) button
2. Fill in the form:
   - Name: "محمد علی"
   - Role: "دندان پزشک"
   - Phone: "+964 750 123 4567"
   - Basic Salary: 1500000
3. Click "زیادکردن" (Add) button

### 2. Record an Advance Payment
1. Click "تۆمارکردنی پێشەکی" (Record Advance) button
2. Select staff member from dropdown
3. Enter amount: "200000"
4. Add note: "پێشەکی بۆ خریداری"
5. Click "تۆمارکردن" (Record) button

### 3. View Calculations
- The table shows:
  - Total advances for current month
  - Remaining salary (auto-calculated)
  - Color-coded based on remaining amount

## Design Features

### Color Scheme
- **Primary**: Blue (#3B82F6) - Main actions
- **Amber**: (#D97706) - Advances
- **Green**: (#10B981) - Active status, success
- **Red**: (#EF4444) - Negative remaining salary
- **Gray**: (#6B7280) - Inactive status

### Typography
- **Headers**: Bold, large (for titles)
- **Labels**: Medium weight, 14px (for form labels)
- **Body**: Regular weight, 14px (for table data)
- **All text in Kurdish Sorani**

### Spacing & Layout
- 6px padding on main container
- 4px gap between grid items
- Responsive grid: 1 column (mobile) → 3 columns (desktop)
- RTL-aware layouts with proper alignment

### Icons Used (Lucide React)
- `Plus`: Add buttons
- `Trash2`: Delete action
- `Phone`: Phone number field
- `DollarSign`: Salary/amount fields
- `User`: Staff icon
- `TrendingDown`: Advances amount
- `Search`: Search input

## Technical Stack

### Frontend
- **React 19**: Latest React version
- **Next.js 16**: Full-stack framework
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Styling
- **Shadcn/UI**: Component library
- **Lucide React**: Icons

### Backend
- **Next.js API Routes**: Server endpoints
- **Drizzle ORM**: Database access
- **Neon PostgreSQL**: Database

### Libraries
- **Sonner**: Toast notifications
- **Zod**: Data validation (ready to implement)

## Installation & Setup

### 1. Database Migration
```bash
# Apply migration
npm run drizzle:push

# Or manually run the migration file
migrations/0006_update_staff_schema.sql
```

### 2. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### 3. Access the Page
Navigate to: `http://localhost:3000/dashboard/staff`

## File Structure

```
app/
├── dashboard/
│   └── staff/
│       └── page.tsx (Main Staff Page)
├── api/
│   ├── staff/
│   │   └── route.ts (Staff CRUD API)
│   └── transactions/
│       └── route.ts (Transactions API)
db/
├── schema.ts (Database schema)
└── drizzle.ts (Drizzle config)
migrations/
└── 0006_update_staff_schema.sql
```

## Responsive Breakpoints

- **Mobile** (< 768px): Single column, stacked buttons
- **Tablet** (768px - 1024px): 2 columns for cards
- **Desktop** (> 1024px): 3 columns for stats, full table width

## Kurdish Sorani Labels Reference

| English | Kurdish |
|---------|---------|
| Add Staff | زیادکردنی کارمەند |
| Record Advance | تۆمارکردنی پێشەکی |
| Staff Name | ناوی کارمەند |
| Job Role | پلەی وەزیفی |
| Phone Number | ژمارە تێلیفۆن |
| Basic Salary | مووچەی بنەڕەتی |
| Monthly Advances | کۆی پێشەکییەکان |
| Remaining Salary | بڕی ماوەی مووچە |
| Status | بارودۆخ |
| Actions | کردارەکان |
| Active | چالاک |
| Inactive | ناچالاک |
| Add | زیادکردن |
| Close | داخستن |
| Record | تۆمارکردن |
| Note | تێبینی |

## Future Enhancements

1. **Export to PDF/Excel**: Generate payroll reports
2. **Salary History**: Track salary changes over time
3. **Payroll Processing**: Automated monthly payroll
4. **Advanced Filters**: Filter by date range, status
5. **Bulk Actions**: Delete or update multiple staff
6. **Audit Logs**: Track all changes
7. **Dashboard Widgets**: Quick stats on dashboard
8. **Email Notifications**: Notify on transactions
9. **Role-Based Access**: Admin/Manager permissions
10. **Advance Approval Workflow**: Multi-step approval process

## Troubleshooting

### Issue: Database schema mismatch
**Solution**: Run the migration file `migrations/0006_update_staff_schema.sql`

### Issue: RTL not working
**Solution**: Ensure `dir="rtl"` is set on the root div. Check Tailwind config for RTL support.

### Issue: Calculations incorrect
**Solution**: Verify transaction dates match current month. Check timezone settings.

### Issue: API not responding
**Solution**: Check server logs, verify database connection, check API route files.

## Support & Maintenance

For updates or issues:
1. Check the database schema matches the current version
2. Verify all API endpoints are accessible
3. Clear browser cache if UI doesn't update
4. Check console for TypeScript/validation errors

---

**Version**: 1.0.0  
**Last Updated**: April 18, 2026  
**Language**: Kurdish Sorani (کوردی سۆرانی)
