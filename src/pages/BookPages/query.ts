import type { Book } from "../AuthorPages/query"
import type { QueryObserverBaseResult } from "react-query"
import { useQuery } from "react-query"

const getBookById = async (id: string) => {
  const response = await fetch(`/books/${id}`)
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(`Unauthorized`)
    }
    throw new Error(`Network response was not ok`)
  }
  const payload = await response.json()
  return payload.data
}

export function useBook(bookId: string): QueryObserverBaseResult<Book, Error> {
  return useQuery<Book, Error>([`book`, bookId], () => getBookById(bookId), {
    enabled: !!bookId,
  })
}
