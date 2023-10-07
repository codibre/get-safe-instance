/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CircuitBreaker = require('opossum');
import { raceFactory } from './race-factory';

let CircuitBreakerCls: typeof CircuitBreaker | undefined;

function getSafeMethodFactory<T extends object>(
	timeout: number,
	source: T,
	breakerOptions: CircuitBreaker.Options,
	onError: undefined | ((key: string, args: unknown[], err: Error) => unknown),
) {
  CircuitBreakerCls ??= require('opossum') as typeof CircuitBreaker;
	return (method: PromiseMethods<T>) => {
    const getBufferCb = new (CircuitBreakerCls as typeof CircuitBreaker)(
      raceFactory(timeout, (source[method as unknown as keyof T] as Function).bind(source)),
      breakerOptions,
    );
    const safeMethod = getBufferCb.fire.bind(getBufferCb);
    return [method, async (...args: any[]) => {
      try {
        const result = safeMethod(...args);
        return await result;
      } catch (err) {
        onError?.(method as any, args, err);
      }
    }] as unknown as [string, Function];
  };
}

type PickMatching<T, V> =
    { [K in keyof T as T[K] extends V ? K : never]: T[K] };

export type PromiseMethods<T extends object> = keyof PickMatching<T, (...args: any[]) => Promise<any>>;

export function getSafeInstance<T extends object>(
	source: T,
	timeout: number,
  methods: PromiseMethods<T>[],
	onError?: ((key: string, args: unknown[], err: Error) => unknown),
): T {
  const group = `getSafeInstance:${Date.now().toString()}`;
  const breakerOptions: CircuitBreaker.Options = {
    timeout,
    volumeThreshold: 30,
    group,
  };
  const map = new Map(methods.map(getSafeMethodFactory(timeout, source, breakerOptions, onError)));
  return new Proxy(source, {
    get(target, method: string) {
      const func = map.get(method);
      if (func) {
        return func;
      }
      const value = target[method as keyof T];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}
