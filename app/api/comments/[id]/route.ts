import { NextRequest, NextResponse } from 'next/server'

// Placeholder API route - Firebase integration coming soon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({
    error: 'Firebase comments API not implemented yet'
  }, { status: 501 })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({
    error: 'Firebase comments API not implemented yet'
  }, { status: 501 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({
    error: 'Firebase comments API not implemented yet'
  }, { status: 501 })
}