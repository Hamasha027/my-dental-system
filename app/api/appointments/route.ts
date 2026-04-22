import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { appointmentsTable } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const appointments = await db
      .select()
      .from(appointmentsTable)
      .orderBy(desc(appointmentsTable.createdAt));

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { message: 'هەڵە لە هێنانی نووسینی دانگی' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, gender, phone, age, treatmentType, appointmentDate, money } =
      await request.json();

    if (!name || !gender || !phone || !age || !treatmentType || !appointmentDate) {
      return NextResponse.json(
        { message: 'هەموو زانیاریەکان پێویسن' },
        { status: 400 }
      );
    }

    const appointment = await db
      .insert(appointmentsTable)
      .values({
        name,
        gender,
        phone,
        age,
        treatmentType,
        appointmentDate,
        money: money ? money.toString() : '0',
      })
      .returning();

    return NextResponse.json(
      { message: 'سەرکەوتووبوو', appointment: appointment[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { message: 'هەڵەیەک ڕویدا لە سروەر' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, gender, phone, age, treatmentType, appointmentDate, money } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'ئیدی پێویستە' },
        { status: 400 }
      );
    }

    if (!name || !gender || !phone || !age || !treatmentType || !appointmentDate) {
      return NextResponse.json(
        { message: 'هەموو زانیاریەکان پێویسن' },
        { status: 400 }
      );
    }

    const [appointment] = await db
      .update(appointmentsTable)
      .set({
        name,
        gender,
        phone,
        age,
        treatmentType,
        appointmentDate,
        money: money ? money.toString() : '0',
      })
      .where(eq(appointmentsTable.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { message: 'سەرکەوتووبوو', appointment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { message: 'هەڵەیەک ڕویدا لە سروەر' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ئیدی پێویستە' },
        { status: 400 }
      );
    }

    await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.id, parseInt(id)));

    return NextResponse.json(
      { message: 'سەرکەوتووبوو' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { message: 'هەڵەیەک ڕویدا لە سروەر' },
      { status: 500 }
    );
  }
}
