import type { Author, Book } from "../pages/AuthorPages/query"

import type { FC } from "react"
import { Link } from "react-router-dom"
import { useState } from "react"

type Props = {
  author: Author
  onEdit: (author: Author, field: string, value: string) => void
}

const AuthorCard: FC<Props> = ({ author, onEdit }) => {
  const [firstName, setFirstName] = useState(author.attributes[`first-name`])
  const [lastName, setLastName] = useState(author.attributes[`last-name`])

  return (
    <div key={author.id}>
      <div>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <button onClick={() => onEdit(author, `first-name`, firstName)}>UPDATE</button>
      </div>
      <div>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <button onClick={() => onEdit(author, `last-name`, lastName)}>UPDATE</button>
      </div>
      <ul>
        {author.books?.map((book: Book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>{book.attributes[`name`]}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AuthorCard
