import type { QueryObserverBaseResult } from "react-query"
import { useQuery } from "react-query"

export type Relationship = {
  type: string
  id: string
}

export type Model = {
  id: string
  type: string
  attributes: any // eslint-disable-line
  relationships: Record<string, { data: Relationship[] }>
}

export interface Book extends Model {
  id: string
  attributes: {
    "name": string //eslint-disable-line
    "isbn": string //eslint-disable-line
  }
}

export interface Author extends Model {
  id: string
  attributes: {
    "first-name": string //eslint-disable-line
    "last-name": string //eslint-disable-line
  }
  relationships: { books: { data: Relationship[] } }
  books: Book[]
}

const getAuthorById = async (id: string) => {
  const response = await fetch(`/authors/${id}`)
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(`Unauthorized`)
    }
    throw new Error(`Network response was not ok`)
  }
  const payload = await response.json()
  return payload.data
}

export function useAuthor(authorId: string): QueryObserverBaseResult<Author, Error> {
  return useQuery<Author, Error>([`author`, authorId], () => getAuthorById(authorId), {
    enabled: !!authorId,
  })
}

export function useAuthors(): QueryObserverBaseResult<Author[], Error> {
  return useQuery<Author[], Error>(`authors`, async () => {
    const response = await fetch(`/authors?include=books`)
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(`Unauthorized`)
      }
      throw new Error(`Network response was not ok`)
    }
    const payload = await response.json()
    const books: Book[] = payload.included.filter(
      (includedModel: Model) => includedModel.type === `books`
    )
    payload.data.forEach((author: Author) => {
      author.books = books.filter((book: Book) =>
        author.relationships.books.data.filter((r: Relationship) => r.id !== book.id)
      )
    })
    return payload.data
  })
}
