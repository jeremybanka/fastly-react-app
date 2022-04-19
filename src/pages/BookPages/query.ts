import type { Book } from "../AuthorPages/query"
import type { Session } from "../../auth/session"
import { getToken } from "../../auth/session"
import useSWR from "swr"

export function useBook(session: Session, bookId: string): Book {
  if (session == null) throw new Error(`No session`)
  const token = getToken()
  const fetcher = (url: string) =>
    fetch(url, {
      headers: { "fastly-key": token?.access_token || `` },
    }).then((response) => response.json())
  const { data, error } = useSWR(`/books/${bookId}`, fetcher)
  if (!data) return data
  if (error) throw error
  return data.data
}
