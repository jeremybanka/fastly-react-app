import { Link, useParams } from "react-router-dom"

import type { FC } from "react"
import Session from "../../auth/session"
import sessionState from "../../atoms/session"
import { usePost } from "./query"
import { useRecoilValue } from "recoil"

type Params = {
  id: string
}

const PostPage: FC = () => {
  const { id } = useParams<Params>()
  const session = useRecoilValue(sessionState) as Session
  const { status, data, error, isFetching } = usePost(id)

  return (
    <div>
      <div>
        {session?.user?.name}
        <Link to={`/posts`}> Back </Link>
      </div>
      {!id || status === `loading` ? (
        `Loading...`
      ) : status === `error` ? (
        <span>Error: {error?.message}</span>
      ) : (
        <>
          <h1>{data?.title}</h1>
          <div>
            <p>{data?.body}</p>
          </div>
          <div>{isFetching ? `Background Updating...` : ` `}</div>
        </>
      )}
    </div>
  )
}

export default PostPage
