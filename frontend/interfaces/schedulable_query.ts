import { IFormField } from "./form_field";
import { IPack } from "./pack";
import { IPlatformString } from "./platform";

// Query itself
export interface ISchedulableQuery {
  created_at: string;
  updated_at: string;
  id: number;
  name: string;
  description: string;
  query: string;
  team_id: number | null;
  interval: number;
  platform: IPlatformString; // Might more accurately be called `platforms_to_query` – comma-sepparated string of platforms to query, default all platforms if ommitted
  min_osquery_version: string;
  automations_enabled: boolean;
  logging: QueryLoggingOption;
  saved: boolean;
  author_id: number;
  author_name: string;
  author_email: string;
  observer_can_run: boolean;
  packs: IPack[];
  stats: ISchedulableQueryStats;
}
export interface ISchedulableQueryStats {
  user_time_p50?: number;
  user_time_p95?: number;
  system_time_p50?: number;
  system_time_p95?: number;
  total_executions?: number;
}

// API shapes

// Get a query by id
/** GET /api/v1/fleet/queries/{id}` */
export interface IGetQueryResponse {
  query: ISchedulableQuery;
}

// List global or team queries
/**  GET /api/v1/fleet/queries?order_key={column_from_queries_table}&order_direction={asc|desc}&team_id={team_id} */
export interface IListQueriesResponse {
  queries: ISchedulableQuery[];
}

// Create a new query
/** POST /api/v1/fleet/queries */
export interface ICreateQueryRequestBody {
  name: string;
  query: string;
  description?: string;
  observer_can_run?: boolean;
  team_id?: number; // global query if ommitted
  interval?: number; // default 0 means never run
  platform?: IPlatformString; // Might more accurately be called `platforms_to_query` – comma-sepparated string of platforms to query, default all platforms if ommitted
  min_osquery_version?: string; // default all versions if ommitted
  automations_enabled?: boolean; // whether to send data to the configured log destination according to the query's `interval`. Default false if ommitted.
  logging?: QueryLoggingOption;
}

// response is ISchedulableQuery

// Modify a query by id
/** PATCH /api/v1/fleet/queries/{id} */
export interface IModifyQueryRequestBody
  extends Omit<ICreateQueryRequestBody, "name" | "query"> {
  id: number;
  name?: string;
  query?: string;
}

// response is ISchedulableQuery // better way to indicate this?

// Delete a query by name
/** DELETE /api/v1/fleet/queries/{name} */
export interface IDeleteQueryRequestBody {
  team_id?: number; // searches for a global query if ommitted
}

// Delete a query by id
// DELETE /api/v1/fleet/queries/id/{id}
// (no body)

// Delete queries by id
/** POST /api/v1/fleet/queries/delete */
export interface IDeleteQueriesRequestBody {
  ids: number[];
}

export interface IDeleteQueriesResponse {
  deleted: number; // number of queries deleted
}

export interface IQueryFormFields {
  name: IFormField<string>;
  description: IFormField<string>;
  query: IFormField<string>;
  observer_can_run: IFormField<boolean>;
  frequency: IFormField<number>;
  platforms: IFormField<IPlatformString>;
  min_osquery_version: IFormField<string>;
  logging: IFormField<QueryLoggingOption>;
}

export type QueryLoggingOption =
  | "snapshot"
  | "differential"
  | "differential_ignore_removals";
