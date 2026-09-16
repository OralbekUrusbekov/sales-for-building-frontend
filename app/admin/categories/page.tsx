'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { categoriesConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={categoriesConfig} />
}
