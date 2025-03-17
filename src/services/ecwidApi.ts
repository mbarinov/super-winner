interface Category {
  id: number
  name: string
  description: string
  imageUrl: string
  parentId: number
  enabled: boolean
  orderBy: number
  productCount: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: number
  enabled: boolean
  sku: string
}

interface CartItem {
  id: number
  name: string
  price: number
  imageUrl: string
  quantity: number
}

const STORE_ID = '108362264'
const API_TOKEN = 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs'
const BASE_URL = `https://app.ecwid.com/api/v3/${STORE_ID}`

const headers = {
  Authorization: `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json',
}

async function handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error(`${errorMessage}:`, error)
    throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export const ecwidApi = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/categories`, { headers })
    const data = await handleResponse<{ items: Category[] }>(response, 'Failed to fetch categories')
    return data.items
  },

  async getCategory(id: number): Promise<Category> {
    const response = await fetch(`${BASE_URL}/categories/${id}`, { headers })
    return handleResponse<Category>(response, 'Failed to fetch category')
  },

  async getProducts(categoryId?: number): Promise<Product[]> {
    const url = new URL(`${BASE_URL}/products`)
    if (categoryId) {
      url.searchParams.append('category', categoryId.toString())
    }
    const response = await fetch(url.toString(), { headers })
    const data = await handleResponse<{ items: Product[] }>(response, 'Failed to fetch products')
    return data.items
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`, { headers })
    return handleResponse<Product>(response, 'Failed to fetch product')
  },
}

export type { Category, Product, CartItem }
