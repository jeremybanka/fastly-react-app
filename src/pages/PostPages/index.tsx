import type { FC } from "react"
import { Link } from "react-router-dom"
import type { Post } from "./query"
import React from "react"
import { usePosts } from "./query"
import { useQueryClient } from "react-query"

const Posts: FC = () => {
  const queryClient = useQueryClient()
  const posts = usePosts()

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {posts.status === `loading` ? (
          `Loading...`
        ) : posts.status === `error` ? (
          <span>Error: {posts?.error?.message}</span>
        ) : (
          <>
            <div>
              {posts?.data?.map((post: Post) => (
                <p key={post.id}>
                  <Link
                    data-testid={post.id}
                    to={`/posts/${post.id}`}
                    style={
                      // We can access the query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData([`post`, post.id])
                        ? { fontWeight: `bold`, color: `green` }
                        : {}
                    }
                  >
                    {post.title}
                  </Link>
                </p>
              ))}
            </div>
            <div>{posts.isFetching ? `Background Updating...` : ` `}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default Posts
