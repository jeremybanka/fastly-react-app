import Services from "./Services";

export { Services };

export type ServiceType = {
  comment: string,
  created_at: string,
  customer_id: string,
  id: string,
  name: string,
  type: string,
  updated_at: string,
  version: number,
  versions: Object[],
};
