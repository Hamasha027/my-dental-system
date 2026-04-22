import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { salesTable } from '@/db/schema'
import { eq, and, gte, lte, desc, ilike } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let conditions = []

    if (search && search.trim()) {
      conditions.push(
        ilike(salesTable.productName, `%${search}%`)
      )
    }

    if (from) {
      conditions.push(gte(salesTable.date, from))
    }

    if (to) {
      conditions.push(lte(salesTable.date, to))
    }

    const sales = await db
      .select()
      .from(salesTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(salesTable.date))

    return NextResponse.json(sales, { status: 200 })
  } catch (error) {
    console.error('Error fetching sales:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Error fetching sales', error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, category, price, quantity = 1, date, notes } = body

    if (!productName || !category || !price || !date) {
      return NextResponse.json(
        { message: 'Missing required fields: productName, category, price, date' },
        { status: 400 }
      )
    }

    const totalPrice = Number(price) * Number(quantity)
    const profit = totalPrice

    const [sale] = await db
      .insert(salesTable)
      .values({
        productName: productName.trim(),
        category: category.trim(),
        price: String(Number(price)),
        quantity: Number(quantity),
        totalPrice: String(totalPrice),
        profit: String(profit),
        date: date,
        notes: notes?.trim() || null,
      })
      .returning()

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error('Error creating sale:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Error creating sale', error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, productName, category, price, quantity, date, notes } = body

    if (!id) {
      return NextResponse.json({ message: 'Sale ID is required' }, { status: 400 })
    }

    const totalPrice = Number(price) * Number(quantity)
    const profit = totalPrice

    const [sale] = await db
      .update(salesTable)
      .set({
        productName: productName.trim(),
        category: category.trim(),
        price: String(Number(price)),
        quantity: Number(quantity),
        totalPrice: String(totalPrice),
        profit: String(profit),
        date: date,
        notes: notes?.trim() || null,
      })
      .where(eq(salesTable.id, id))
      .returning()

    if (!sale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404 })
    }

    return NextResponse.json(sale, { status: 200 })
  } catch (error) {
    console.error('Error updating sale:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Error updating sale', error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'Sale ID is required' }, { status: 400 })
    }

    const [sale] = await db
      .delete(salesTable)
      .where(eq(salesTable.id, Number(id)))
      .returning()

    if (!sale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Sale deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting sale:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Error deleting sale', error: message }, { status: 500 })
  }
}
