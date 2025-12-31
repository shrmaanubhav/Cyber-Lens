export type IocType = "ip" | "domain" | "url" | "hash";

export interface ThreatIntelProvider<
  TResponse = unknown,
  TOptions = Record<string, unknown>
> {
  /** Identifier used across logs, configs, and UI */
  readonly name: string;

  /** IOC categories this provider can handle */
  readonly supportedIocTypes: ReadonlyArray<IocType>;

  /**
   * Fetch intelligence for a single indicator.
   * Returns provider-specific data for downstream normalization.
   */
  query(ioc: string, type: IocType, options?: TOptions): Promise<TResponse>;
}
