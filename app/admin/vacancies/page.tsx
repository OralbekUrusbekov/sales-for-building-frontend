'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { vacanciesConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={vacanciesConfig} />
}
