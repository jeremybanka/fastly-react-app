import * as React from "react"

import { Redirect } from "react-router-dom"
import sessionState from "../atoms/session"
import { useRecoilValue } from "recoil"

type Props = {
  render: React.Node,
}
const UserData = (props: Props) => {
  const session = useRecoilValue(sessionState)
  if (session == null || session.user.id == null) {
    return <Redirect to={"/auth"} />
  }
  return props.render(session)
}

function EnsureAuth(props: Props): React.Node {
  return (
    <React.Suspense fallback="">
      <UserData render={props.render} />
    </React.Suspense>
  )
}

export default EnsureAuth
