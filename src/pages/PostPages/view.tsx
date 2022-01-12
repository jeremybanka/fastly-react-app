import { Link, useParams } from "react-router-dom"

import { usePost } from "./query"

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
