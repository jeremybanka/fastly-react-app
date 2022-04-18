import { Link, useParams } from "react-router-dom"

import type { FC } from "react"
import useAuth from "../../components/AuthProvider/use"
import { useBook } from "./query"

type Params = {
  id: string
}

const BookPage: FC = () => {
  const { session } = useAuth()
  const { id } = useParams<Params>()
  const { status, data, error, isFetching } = useBook(id)

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
          <h1>{data?.attributes[`name`]}</h1>
          <h1>{data?.attributes[`isbn`]}</h1>
          <div>{isFetching ? `Background Updating...` : ` `}</div>
        </>
      )}
    </div>
  )
}

export default BookPage
