'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { mastersConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={mastersConfig} />
}
