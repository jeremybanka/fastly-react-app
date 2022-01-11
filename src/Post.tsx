import { Link, useParams } from "react-router-dom"

import { useQuery } from "react-query";

const getPostById = async (id: string) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized")
    }
    throw new Error("Network response was not ok")
  }
  const payload = await response.json()
  return payload
};

function usePost(postId: any) {
  return useQuery(["post", postId], () => getPostById(postId), {
    enabled: !!postId,
  });
}

export default function Post({ session }: any) {
  // @ts-ignore
  const { id } = useParams()
  const { status, data, error, isFetching } = usePost(id);

  return (
    <div>
      <div>
        {session.user.name}
        <Link
          to={`/posts`}
        >
          Back
        </Link>
      </div>
      {!id || status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        // @ts-ignore
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1>{data.title}</h1>
          <div>
            <p>{data.body}</p>
          </div>
          <div>{isFetching ? "Background Updating..." : " "}</div>
        </>
      )}
    </div>
  );
}
