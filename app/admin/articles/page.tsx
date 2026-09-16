'use client'
import { ResourceManager } from '@/components/admin/ResourceManager'
import { articlesConfig } from '@/lib/admin/resources'

export default function Page() {
  return <ResourceManager config={articlesConfig} />
}
