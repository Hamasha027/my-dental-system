import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { 
  appointmentsTable, 
  staffTable, 
  salesTable, 
  expensesTable,
  installmentsTable 
} from '@/db/schema';
import { sql, and, gte, lt, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getNextMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const now = new Date();
    const monthStart = getMonthStart(now);
    const nextMonthStart = getNextMonthStart(now);
    const monthStartStr = toDateOnly(monthStart);
    const nextMonthStartStr = toDateOnly(nextMonthStart);

    // Get current month appointments
    const currentMonthAppointments = await db
      .select()
      .from(appointmentsTable)
      .where(
        and(
          gte(appointmentsTable.appointmentDate, monthStartStr),
          lt(appointmentsTable.appointmentDate, nextMonthStartStr)
        )
      );

    // Get all appointments for comparison
    const allAppointments = await db.select().from(appointmentsTable);
    
    // Get previous month appointments
    const prevMonthStart = getMonthStart(new Date(now.getFullYear(), now.getMonth() - 1));
    const prevMonthStartStr = toDateOnly(prevMonthStart);
    const prevMonthAppointments = await db
      .select()
      .from(appointmentsTable)
      .where(
        and(
          gte(appointmentsTable.appointmentDate, prevMonthStartStr),
          lt(appointmentsTable.appointmentDate, monthStartStr)
        )
      );

    // Calculate revenue from appointments
    const currentMonthRevenue = currentMonthAppointments.reduce(
      (sum, apt) => sum + Number(apt.money || 0), 
      0
    );
    
    const prevMonthRevenue = prevMonthAppointments.reduce(
      (sum, apt) => sum + Number(apt.money || 0), 
      0
    );

    // Get sales revenue
    const currentMonthSales = await db
      .select()
      .from(salesTable)
      .where(
        and(
          gte(salesTable.date, monthStartStr),
          lt(salesTable.date, nextMonthStartStr)
        )
      );

    const salesRevenue = currentMonthSales.reduce(
      (sum, sale) => sum + Number(sale.totalPrice || 0), 
      0
    );

    const totalRevenue = currentMonthRevenue + salesRevenue;

    // Get expenses
    const currentMonthExpenses = await db
      .select()
      .from(expensesTable)
      .where(
        and(
          gte(expensesTable.date, monthStartStr),
          lt(expensesTable.date, nextMonthStartStr)
        )
      );

    const totalExpenses = currentMonthExpenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0), 
      0
    );

    // Get staff count
    const staff = await db.select().from(staffTable);
    const activeStaff = staff.filter(s => s.status === 'Active').length;

    // Get unique patients (by phone number)
    const uniquePatients = new Set(allAppointments.map(apt => apt.phone)).size;

    // Get pending installments
    const pendingInstallments = await db
      .select()
      .from(installmentsTable)
      .where(sql`${installmentsTable.status} = 'Pending'`);

    const pendingInstallmentsAmount = pendingInstallments.reduce(
      (sum, inst) => sum + Number(inst.remainingAmount || 0), 
      0
    );

    // Calculate trends
    const appointmentTrend = prevMonthAppointments.length > 0 
      ? ((currentMonthAppointments.length - prevMonthAppointments.length) / prevMonthAppointments.length) * 100
      : 0;

    const revenueTrend = prevMonthRevenue > 0
      ? ((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
      : 0;

    // Get last 6 months data for charts
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const chartDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const chartMonthStart = getMonthStart(chartDate);
      const chartNextMonthStart = getNextMonthStart(chartDate);
      const chartMonthStartStr = toDateOnly(chartMonthStart);
      const chartNextMonthStartStr = toDateOnly(chartNextMonthStart);

      const monthAppointments = await db
        .select()
        .from(appointmentsTable)
        .where(
          and(
            gte(appointmentsTable.appointmentDate, chartMonthStartStr),
            lt(appointmentsTable.appointmentDate, chartNextMonthStartStr)
          )
        );

      const monthSales = await db
        .select()
        .from(salesTable)
        .where(
          and(
            gte(salesTable.date, chartMonthStartStr),
            lt(salesTable.date, chartNextMonthStartStr)
          )
        );

      const monthRevenue = monthAppointments.reduce(
        (sum, apt) => sum + Number(apt.money || 0), 
        0
      ) + monthSales.reduce(
        (sum, sale) => sum + Number(sale.totalPrice || 0), 
        0
      );

      chartData.push({
        month: chartDate.toLocaleDateString('ku-IQ', { month: 'short' }),
        revenue: Math.round(monthRevenue),
        appointments: monthAppointments.length,
      });
    }

    // Get recent appointments for table
    const recentAppointments = await db
      .select()
      .from(appointmentsTable)
      .orderBy(desc(appointmentsTable.createdAt))
      .limit(10);

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        appointmentsCount: currentMonthAppointments.length,
        uniquePatients,
        activeStaff,
        pendingInstallmentsAmount,
        appointmentTrend,
        revenueTrend,
      },
      chartData,
      recentAppointments,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { message: 'هەڵە لە هێنانی ئامارەکان' },
      { status: 500 }
    );
  }
}
