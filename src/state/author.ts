import type { JsonApiDocument, JsonApiResource, ResourceObject } from "@recash/core"
import { createAuthor, destroyAuthor, listAuthors, updateAuthor } from "./author-queries"
import { query, store } from "@recash/core"

import type { BookResource } from "./book"

export type Author = {
  "first-name": string //eslint-disable-line
  "last-name": string //eslint-disable-line
}

export const EMPTY_AUTHOR_RO: ResourceObject<AuthorResource> = {
  type: `author`,
  id: `foo`,
  attributes: {
    "first-name": ``,
    "last-name": ``,
  },
}

export const EMPTY_TEMPLATE_RO: ResourceObject<TemplateResource> = {
  id: ``,
  type: `author`,
  attributes: {
    "first-name": ``,
    "last-name": ``,
  },
}

export interface AuthorResource extends JsonApiResource {
  type: `author`
  attributes: Author
  relationships: {
    books: {
      data: BookResource[]
    }
  }
}

export type Template = {
  id: string
}

export interface TemplateResource extends JsonApiResource {
  type: `author`
  attributes: Author
}

export const readAuthor = async (id: string): Promise<JsonApiDocument<AuthorResource>> =>
  query(`/authors/${id}`)

export const readTemplate = async (id: string): Promise<JsonApiDocument<TemplateResource>> =>
  query(`/api/template/${id}`)

export const authorStore = store({
  key: `author`,
  queries: {
    read: readTemplate,
    create: createAuthor,
    list: listAuthors,
    destroy: destroyAuthor,
    update: updateAuthor,
  },
})
