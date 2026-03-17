import { redirect } from 'next/navigation'

export default function DemoRedirect() {
  redirect('/results/00000000-0000-0000-0000-000000000001')
}
