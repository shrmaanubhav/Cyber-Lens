import { detectIocType, validateIocType } from "../utils/iocUtils";
import {
  executeProviders,
  type ProviderExecutionResult,
} from "./providerExecutor";
import type {
  IocType,
  ThreatIntelProvider,
} from "../constants/provider.interface";

export interface OrchestratedResponse<TResponse = unknown> {
  ioc: string;
  detectedType: IocType | null;
  validation: {
    isValid: boolean;
    userSelectedType?: IocType;
  };
  providers: ProviderExecutionResult<TResponse>[];
  meta: {
    executedAt: string;
    executionTimeMs: number;
    detected: {
      ipVersion?: 4 | 6;
    } | null;
  };
}

export interface OrchestratorOptions<TOptions = Record<string, unknown>> {
  userSelectedType?: IocType;
  providerOptions?: TOptions;
  timeoutMs?: number;
}

export async function orchestrateThreatIntelligence<
  TResponse = unknown,
  TOptions = Record<string, unknown>
>(
  ioc: string,
  providers: ReadonlyArray<ThreatIntelProvider<TResponse, TOptions>>,
  options: OrchestratorOptions<TOptions> = {}
): Promise<OrchestratedResponse<TResponse>> {
  const startTime = Date.now();

  const detected = detectIocType(ioc);
  let validation = { isValid: true }; // Default valid if no user selection
  
  if (options.userSelectedType) {
    validation = validateIocType(ioc, options.userSelectedType);
  }

  // -------------------Handle case where IOC type cannot be detected--------------------------
  if (!detected.type) {
    return {
      ioc,
      detectedType: null,
      validation: {
        ...validation,
        userSelectedType: options.userSelectedType,
      },
      providers: [],
      meta: {
        executedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime,
        detected: null,
      },
    };
  }

  const providerResults = await executeProviders(
    providers,
    ioc,
    detected.type,
    {
      timeoutMs: options.timeoutMs,
      providerOptions: options.providerOptions,
    }
  );

  const executionTimeMs = Date.now() - startTime;

  return {
    ioc,
    detectedType: detected.type,
    validation: {
      ...validation,
      userSelectedType: options.userSelectedType,
    },
    providers: providerResults,
    meta: {
      executedAt: new Date().toISOString(),
      executionTimeMs,
      detected: {
        ipVersion: detected.ipVersion,
      },
    },
  };
}
