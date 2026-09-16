'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { servicesConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={servicesConfig} />
}
