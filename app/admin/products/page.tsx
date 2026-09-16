'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { productsConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={productsConfig} />
}
