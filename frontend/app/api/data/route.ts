import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${API_URL}/api/portfolio/`, {
      cache: 'no-store' // Always fetch fresh data from Django
    })
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 })
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 500 })
  }
}
