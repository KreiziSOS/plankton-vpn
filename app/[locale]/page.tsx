import Landing from '@/components/Landing'

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <Landing locale={locale} />
}