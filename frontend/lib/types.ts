export type FilePublic = {
  id: string
  filename: string
  slug: string
  file_type: string
  minecraft_version: string | null
  loader: string | null
  description: string | null
  tags: string | null
  file_size: number
  sha1_hash: string
  download_count: number
  created_at: string
  last_download: string | null
  expire_at: string
}

export type ResourcePackGeneratorInfo = {
  download_url: string
  sha1: string
  server_properties_snippet: string
}

export type FileCreateResponse = {
  id: string
  slug: string
  landing_page_url: string
  delete_token: string
  resource_pack: ResourcePackGeneratorInfo | null
}
