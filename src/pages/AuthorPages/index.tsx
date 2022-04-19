import type { Author } from "./query"
import AuthorCard from "../../components/AuthorCard"
import type { FC } from "react"
import useAuth from "../../components/AuthProvider/use"
import { useAuthors } from "./query"
// import { useAuthors } from "./query"

const AuthorPages: FC = () => {
  const { session } = useAuth()
  const authors = useAuthors(session)

  function onEdit(author: Author, field: string, value: string) {
    console.log(author, field, value)
  }

  return (
    <div>
      <h1>Authors</h1>
      <div>
        {authors === undefined ? (
          `Loading...`
        ) : authors.status === `error` ? (
          <span>Error: {authors?.error?.message}</span>
        ) : (
          <>
            <div
              style={{
                width: `100%`,
                borderColor: `grey`,
                borderStyle: `solid`,
                borderWidth: `1`,
                borderRadius: `5px`,
                padding: `10px`,
              }}
            >
              {authors?.map((author: Author) => (
                <AuthorCard key={author.id} author={author} onEdit={onEdit} />
              ))}
            </div>
            <div>{authors.isFetching ? `Background Updating...` : ` `}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthorPages
