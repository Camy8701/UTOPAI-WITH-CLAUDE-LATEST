import { NextRequest, NextResponse } from 'next/server'

// Placeholder API route - Firebase integration coming soon
export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'Firebase quiz API not implemented yet'
  }, { status: 501 })
}