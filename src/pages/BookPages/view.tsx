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
  const book = useBook(session, id)

  return (
    <div>
      <div>
        {session?.user?.name}
        <Link to={`/authors`}> Back </Link>
      </div>
      {book == undefined ? (
        `Loading...`
      ) : (
        <>
          <h1>{book?.attributes[`name`]}</h1>
          <h1>{book?.attributes[`isbn`]}</h1>
        </>
      )}
    </div>
  )
}

export default BookPage
