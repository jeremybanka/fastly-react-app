import Sites from "./Sites";

export { Sites };

type ResourceRef = { uri: string };

type Members = ResourceRef & {
  data: {
    user: {
      name: string,
      email: string,
      status: string,
      authStatus: string,
      corpAuthType: string,
      apiUser: boolean,
    },
    role: "owner" | "admin" | "user" | "observer",
  }[],
};

type ClientIPRules = {
  header: string,
};

export type SiteType = {
  name: string,
  displayName: string,
  agentLevel: "log" | "block" | "off",
  agentAnonMode: string,
  blockHTTPCode: number,
  blockDurationSeconds: number,
  created: string,
  whitelist: ResourceRef,
  blacklist: ResourceRef,
  events: ResourceRef,
  requests: ResourceRef,
  redactions: ResourceRef,
  suspiciousIPs: ResourceRef,
  monitors: ResourceRef,
  pathwhitelist: ResourceRef,
  paramwhitelist: ResourceRef,
  integrations: ResourceRef,
  headerLinks: ResourceRef,
  agents: ResourceRef,
  alerts: ResourceRef,
  analyticsEvents: ResourceRef,
  attacksSignalSummary: ResourceRef,
  anomaliesSignalSummary: ResourceRef,
  tags: ResourceRef,
  rules: ResourceRef,
  members: Members,
  cloudwaf: boolean,
  clientIPHeader: ClientIPRules[],
};
