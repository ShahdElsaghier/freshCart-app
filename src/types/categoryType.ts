export interface CategoryType {
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
  image: string
  createdAt: string
  updatedAt: string
}
