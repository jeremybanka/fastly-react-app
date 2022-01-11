import {
  useQuery,
  useQueryClient,
} from "react-query";

import { Link } from "react-router-dom"

function usePosts() {
  return useQuery("posts", async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }
      throw new Error("Network response was not ok")
    }
    const payload = await response.json()
    return payload
  });
}

// @ts-ignore
export default function Posts({ session }: { session: any }) {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = usePosts();

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {status === "loading" ? (
          "Loading..."
        ) : status === "error" ? (
          // @ts-ignore
          <span>Error: {error.message}</span>
        ) : (
          <>
            {session.user.name}
            <div>
              {data.map((post: any) => (
                <p key={post.id}>
                  <Link
                    data-testid={post.id}
                    to={`/posts/${post.id}`}
                    style={
                      // We can access the query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(["post", post.id])
                        ? {
                            fontWeight: "bold",
                            color: "green",
                          }
                        : {}
                    }
                  >
                      {post.title}
                  </Link>
                </p>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}
