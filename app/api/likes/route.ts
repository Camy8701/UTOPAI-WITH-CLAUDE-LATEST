import { NextRequest, NextResponse } from 'next/server'

// Placeholder API route - Firebase integration coming soon
export async function GET(request: NextRequest) {
  return NextResponse.json({
    liked: false,
    like_count: 0,
    message: 'Firebase likes API not implemented yet'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: 'Firebase likes API not implemented yet'
  }, { status: 501 })
}