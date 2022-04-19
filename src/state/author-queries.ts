import type { AuthorResource } from "./author"
import type { JsonApiDocument } from "@recash/core"
import { query } from "@recash/core"

export const readAuthor = async (id: string): Promise<JsonApiDocument<AuthorResource>> =>
  query(`/authors/${id}`)

export type AuthorQueryOptions = Partial<{ include: `books` }>

export const listAuthors = async (
  search?: AuthorQueryOptions
): Promise<JsonApiDocument<AuthorResource[]>> => query(`/authors`, { search })

export const createAuthor = async (
  input: JsonApiDocument<AuthorResource>
): Promise<JsonApiDocument<AuthorResource>> => query(`/authors`, { method: `POST`, input })

export const updateAuthor = async (
  input: JsonApiDocument<AuthorResource>
): Promise<JsonApiDocument<AuthorResource>> =>
  // @ts-expect-error make data non-optional for Documents with rich data
  query(`/authors/${input.data.id}`, { method: `PATCH`, input })

export const destroyAuthor = async (id: string): Promise<JsonApiDocument<AuthorResource>> =>
  query(`/authors/${id}`, { method: `DELETE` })
