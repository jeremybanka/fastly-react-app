import type { Author, Book } from "./query"

import type { FC } from "react"
import { Link } from "react-router-dom"
import React from "react"
import { useAuthors } from "./query"

const AuthorPages: FC = () => {
  const authors = useAuthors()

  return (
    <div>
      <h1>Authors</h1>
      <div>
        {authors.status === `loading` ? (
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
              {authors?.data?.map((author: Author) => (
                <div key={author.id}>
                  <div>
                    <input value={author.attributes[`first-name`]} />
                  </div>
                  <div>
                    <input value={author.attributes[`last-name`]} />
                  </div>
                  <ul>
                    {author.books.map((book: Book) => (
                      <li key={book.id}>
                        <Link to={`/books/${book.id}`}>{book.attributes[`name`]}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
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
