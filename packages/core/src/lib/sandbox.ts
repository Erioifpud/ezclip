import { unsafeWindow } from "$";

export class LoadCodeError extends Error {}

type CodeSandbox = {
  run(code: string): [unknown, unknown]
}

export const createSandbox: () => CodeSandbox = () => {
  const injection = new Map([
    [Symbol.unscopables, undefined],
    ['unsafeWindow', unsafeWindow],
  ] as [keyof any, unknown][])

  const sandbox = new Proxy(Object.create(null), {
    has: () => true,
    get: (_, p: PropertyKey) => {
      return (injection.has(p) ? injection.get(p) : (window as any)[p])
    },
    set: (_, p: PropertyKey, v) => {
      return !injection.has(p) && ((window as any)[p] = v)
    },
  })

  const codeKey = "__code__"
  const fn = Function(
    'window',
    `with (window) {
       return eval(${codeKey})
     }`,
  ).bind(undefined, sandbox)

  return {
    run: (code: string) => {
      injection.set('module', { exports: {} })
      injection.set('exports', {})
      injection.set(codeKey, code)
      let returned
      try {
        returned = fn()
      } catch (e) {
        throw new LoadCodeError(undefined, { cause: e })
      }
      const module = injection.get('module') as Record<string, unknown>
      const exported = module?.exports
      return [exported, returned]
    },
  }
};
