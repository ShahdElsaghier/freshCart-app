export interface SubcategoryType {
  results: number
  metadata: Metadata
  data: Daum[]
}

export interface Metadata {
  currentPage: number
  numberOfPages: number
  limit: number
}

export interface Daum {
  _id: string
  name: string
  slug: string
  category: string
  createdAt: string
  updatedAt: string
}
