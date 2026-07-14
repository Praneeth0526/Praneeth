import BentoGrid from './components/BentoGrid'

async function getPortfolioData() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${API_URL}/api/portfolio/`, {
      cache: 'no-store' // Always get fresh data from Django
    })
    if (!res.ok) {
      console.error('Failed to fetch data from Django API')
      return {}
    }
    return res.json()
  } catch (err) {
    console.error('Error connecting to Django backend:', err)
    return {}
  }
}

export default async function Page() {
  const data = await getPortfolioData()
  return <BentoGrid data={data} />
}
