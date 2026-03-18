import { notFound } from 'next/navigation'
import { getResult } from '@/lib/getResult'
import { createClient } from '@/lib/supabase/server'
import { ResultsClient } from './ResultsClient'

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const data = await getResult(params.id)
  if (!data) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <ResultsClient
      result={data}
      archetypeContent={data.archetypeContent}
      resultId={params.id}
      isAuthenticated={!!user}
    />
  )
}
