'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { brandsConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={brandsConfig} />
}
