import { notFound } from 'next/navigation'
import { getResult } from '@/lib/getResult'
import { ResultsClient } from './ResultsClient'

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const data = await getResult(params.id)
  if (!data) notFound()
  return (
    <ResultsClient result={data} archetypeContent={data.archetypeContent} resultId={params.id} />
  )
}
