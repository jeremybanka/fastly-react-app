import type { JsonApiDocument, JsonApiResource } from "@recash/core"

import type { AuthorResource } from "./author"

export type Book = {
  name: string
  isbn: string
}

export interface BookResource extends JsonApiResource {
  type: `book`
  attributes: Book
  relationships: {
    author: {
      data: AuthorResource
    }
  }
}

export const myExampleBookDoc: JsonApiDocument<BookResource> = {
  data: {
    type: `book`,
    id: `1`,
    attributes: {
      name: `Advanced TypeScript`,
      isbn: `978-1-84628-902-8`,
    },
  },
}
