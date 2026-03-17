import { createServiceClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/archetypes'

export async function getResult(id: string) {
  const supabase = await createServiceClient()
  const { data: result, error } = await supabase
    .from('results')
    .select('*, assessments(id)')
    .eq('id', id)
    .single()

  if (error || !result) return null

  const archetypeDef = ARCHETYPES.find(a => a.slug === result.archetype)
  return {
    ...result,
    archetypeContent: archetypeDef ?? null,
    hpif_profile: {
      ...result.hpif_profile,
      team_compatibility: {
        ...result.hpif_profile.team_compatibility,
        best_partners: archetypeDef?.best_partners ?? [],
        growth_partners: archetypeDef?.growth_partners ?? [],
        friction_archetypes: archetypeDef?.friction_archetypes ?? [],
      },
    },
  }
}
