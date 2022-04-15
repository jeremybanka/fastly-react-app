import type { QueryObserverBaseResult } from "react-query"
import type { Session } from "../../auth/session"
import { getToken } from "../../auth/session"
import { useQuery } from "react-query"

type TlsConfigurationAttributes = {
  [key: string]: string
}

export type TlsConfiguration = {
  id: string
  attributes: TlsConfigurationAttributes
}

const queryKeys = {
  all: [`tlsConfigurations`] as const,
  lists: () => [...queryKeys.all, `list`] as const,
  list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, `detail`] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
}

export function useTlsConfigs(session: Session): QueryObserverBaseResult<TlsConfiguration[]> {
  const getTlsConfigs = async (): Promise<TlsConfiguration[]> => {
    if (session == null) throw new Error(`No session`)
    const token = getToken()
    const response = await fetch(`/tls/configurations`, {
      headers: { "fastly-key": token?.access_token || `` },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(`Unauthorized`)
      }
      throw new Error(`Network response was not ok`)
    }
    const payload = await response.json()
    return payload.data
  }

  return useQuery<TlsConfiguration[], Error>(queryKeys.all, getTlsConfigs)
}

export function useTlsConfig(
  id: string,
  session: Session
): QueryObserverBaseResult<TlsConfiguration> {
  const getTlsConfig = async (id: string): Promise<TlsConfiguration> => {
    if (session == null) throw new Error(`No session`)
    const token = getToken()
    const response = await fetch(`/tls/configurations/${id}`, {
      headers: { "fastly-key": token?.access_token || `` },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(`Unauthorized`)
      }
      throw new Error(`Network response was not ok`)
    }
    const payload = await response.json()
    return payload.data
  }

  return useQuery<TlsConfiguration, Error>(queryKeys.detail(id), () => getTlsConfig(id))
}
