import type { Session } from "../../typings"
type TlsConfigurationAttributes = {
  [key: string]: string
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
  detail: (id: string) => [...queryKeys.details(), id] as const,
}

export function useTlsConfigs(session: Session) {
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

export function useTlsConfig(id: string, session: Session) {
  return async function dumbFetchTlsConfig(): Promise<TlsConfiguration> {
    const response = await fetch(`/tls/configurations/${id}`, {
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
