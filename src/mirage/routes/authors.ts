// being lazy with the typing because I have a deadline for this presentation
export default function AuthRoutes(server: any) { // eslint-disable-line
  server.get(`/authors`, `authors`)
  server.patch(`/authors/:id`, `authors`)
  server.del(`/authors/:id`, `authors`)
  server.post(`/books`, `book`)

  server.get(`/books/:id`, `book`) // NEEDED for react-query
}
