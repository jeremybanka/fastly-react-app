import type { QueryObserverBaseResult } from "react-query"
import { useQuery } from "react-query"

export type Post = {
  id: string
  title: string
  body: string
}

const getPostById = async (id: string) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(`Unauthorized`)
    }
    throw new Error(`Network response was not ok`)
  }
  const payload = await response.json()
  return payload
}

export function usePost(postId: string): QueryObserverBaseResult<Post, Error> {
  return useQuery<Post, Error>([`post`, postId], () => getPostById(postId), {
    enabled: !!postId,
  })
}

export function usePosts(): QueryObserverBaseResult<Post[], Error> {
  return useQuery<Post[], Error>(`posts`, async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(`Unauthorized`)
      }
      throw new Error(`Network response was not ok`)
    }
    const payload = await response.json()
    return payload
  })
}
