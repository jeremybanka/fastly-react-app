import type { Session } from "../../typings"
type TlsConfigurationAttributes = {
  name: string
}

export type TlsConfiguration = {
  id: string
  attributes: TlsConfigurationAttributes
}

export const queryKeys = {
  all: ["tlsConfigurations"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
}

export function fetchTlsConfigs(session: Session) {
  return async function dumbFetchTlsConfigs(): Promise<TlsConfiguration[]> {
    const response = await fetch("/tls/configurations", {
      headers: { "fastly-key": session.token.access_token },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      }
      throw new Error("Network response was not ok")
    }
    const payload = await response.json()
    return payload.data
  }
}
