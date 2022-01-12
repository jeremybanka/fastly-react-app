import { useQuery } from "react-query"

const getPostById = async (id: string) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized")
    }
    throw new Error("Network response was not ok")
  }
  const payload = await response.json()
  return payload
}

export function usePost(postId: any) {
  return useQuery(["post", postId], () => getPostById(postId), {
    enabled: !!postId,
  })
}

export function usePosts() {
  return useQuery("posts", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts")
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }
      throw new Error("Network response was not ok")
    }
    const payload = await response.json()
    return payload
  })
}
