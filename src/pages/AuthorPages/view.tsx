import { Link, useParams } from "react-router-dom"

import type { FC } from "react"
import useAuth from "../../components/AuthProvider/use"
import { useAuthor } from "./query"

type Params = {
  id: string
}

const AuthorPage: FC = () => {
  const { session } = useAuth()
  const { id } = useParams<Params>()
  const { status, data, error, isFetching } = useAuthor(id)

  return (
    <div>
      <div>
        {session?.user?.name}
        <Link to={`/authors`}> Back </Link>
      </div>
      {!id || status === `loading` ? (
        `Loading...`
      ) : status === `error` ? (
        <span>Error: {error?.message}</span>
      ) : (
        <>
          <h1>{data?.attributes[`first-name`]}</h1>
          <h1>{data?.attributes[`last-name`]}</h1>
          {/* TODO: do books here? */}
          <div>{isFetching ? `Background Updating...` : ` `}</div>
        </>
      )}
    </div>
  )
}

export default AuthorPage
