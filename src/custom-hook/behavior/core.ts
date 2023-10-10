import { HTMLAttributes, useState } from "react";

type FIXME = any;

type Dict<T = any> = Record<string, T>;
type StateSchema = Record<string, any>;

export interface Config<
  TContext extends Dict = Dict,
  TState extends StateSchema = StateSchema,
> {
  states: { [K in keyof TState]: StateDef<TContext, TState, TState[K]> };
}

export interface Options<TContext extends Dict, TState extends StateSchema> {
  guards?: Record<string, (state: TState, ctx?: TContext) => boolean>;
}

type StateDef<TContext extends Dict, TState extends StateSchema, T> =
  | FiniteStateDef<TContext, TState, T>
  | InfiniteStateDef<TContext, TState, T>;

interface FiniteStateDef<TContext extends Dict, TState extends StateSchema, T> {
  type: "finite";
  initial: T;
  states: Record<string, StateNode<TState, T>>;
}

interface StateNode<TState extends StateSchema, T> {
  on: Record<string, FiniteTransition<TState, T>>;
}

interface FiniteTransition<TState extends StateSchema, T> {
  guard?: Guard<TState>;
  target: T;
}

interface InfiniteStateDef<
  TContext extends Dict,
  TState extends StateSchema,
  T,
> {
  type: "infinite";
  initial: T;
  writable?: boolean;
  on: Record<string, InfiniteTransition<TContext, TState, T>>;
}

interface InfiniteTransition<
  TContext extends Dict,
  TState extends StateSchema,
  T,
> {
  guard?: Guard<TState>;
  target: (evt: FIXME, obj: { state: T; ctx: TContext }) => T;
}

type Guard<TState extends StateSchema> = string | GuardStateIn<TState>;

interface GuardStateIn<TState extends StateSchema> {
  type: "stateIn";
  state: Partial<TState>;
}

export function createStateHook<
  TContext extends Dict,
  TState extends StateSchema,
>(config: Config<TContext, TState>, options: Options<TContext, TState>) {
  const initialState = Object.fromEntries(
    Object.entries(config.states).map(([key, value]) => [key, value.initial]),
  ) as TState;
  const guards = options.guards ?? {};
  // TODO: create hashmap of transitions for optimization

  const hook = (
    ctx: TContext,
    values: { [S in keyof TState]?: TState[S] },
    callbacks: { [S in keyof TState]?: (value: TState[S]) => void },
  ) => {
    const [snapshot, setSnapshot] = useState(initialState);
    const merged = { ...snapshot, ...values }; // TODO: Can we optimize this to not spread values?

    function getState(key: keyof TState) {
      const controlledValue = values[key];
      if (controlledValue) {
        return controlledValue;
      }
      return snapshot[key];
    }

    function send(evt: { type: string; [k: string]: FIXME }) {
      const patch: Record<string, any> = {};
      const entries = Object.entries(config.states) as [
        string,
        StateDef<Dict, StateSchema, any>,
      ][];

      const checkGuard = (transition: FiniteTransition<StateSchema, any>) => {
        if (!transition.guard) return true;

        if (typeof transition.guard === "string") {
          return guards[transition.guard]?.(merged, ctx) ?? true;
        }
        if (transition.guard.type === "stateIn") {
          return Object.entries(transition.guard.state).every(
            ([key, value]) => merged[key] === value,
          );
        }

        throw new Error(`Invalid guard: ${transition.guard}`);
      };

      for (const [key, value] of entries) {
        if (value.type === "infinite") {
          const transition = value.on[evt.type];
          if (transition && checkGuard(transition)) {
            const target = transition.target(evt, {
              state: getState(key),
              ctx,
            });
            if (merged[key] !== target) {
              if (!values[key]) {
                patch[key] = target;
              }
              callbacks[key]?.(target);
            }
          }
        }
        if (value.type === "finite") {
          const transition = value.states[getState(key)].on[evt.type];
          if (transition && checkGuard(transition)) {
            const target = transition.target;
            if (merged[key] !== target) {
              if (!values[key]) {
                patch[key] = target;
              }
              callbacks[key]?.(target);
            }
          }
        }
      }

      if (Object.keys(patch).length === 0) return;
      setSnapshot((prev) => ({ ...prev, ...patch }));
    }

    return [merged, send] as const;
  };

  return hook;
}

export function stateIn<S extends StateSchema>(
  state: Partial<S>,
): GuardStateIn<S> {
  return { type: "stateIn", state };
}

export function element(
  props: HTMLAttributes<HTMLElement> & Record<string, any>,
): HTMLAttributes<HTMLElement> {
  return props;
}
