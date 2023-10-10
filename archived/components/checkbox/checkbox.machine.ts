import { assign, createMachine } from "xstate";
import { Context, UserDefinedContext } from "./checkbox.types";
export function checkboxMachine(ctx: UserDefinedContext) {
  /** @xstate-layout N4IgpgJg5mDOIC5QGMAWZkGsBGB7AHgHSxgA2GALpAMQDKAogCoD6DAMvQMKP0AiA2gAYAuolAAHXLACWFabgB2YkPkQB2AEwAaEAE9EAZg0bCGgKwBfCzrQYcBYmUo0GLdlx4CAjKKQhJMnKKyqoImjr6CF5mAGyEZgAcBskpqQYALFY26Fh4RCTkyFQQhAq41IwA8gDi1RxCvhJSsvJKfqHpMXFeMemCMeYRiBqCXvFZILa5DgXOJbpwFTV19A3KAS3B7Yid3b39g3qI0V5W1iBlEHDKU-ahTYGtIYgAtBrpQwhvBoS9iQZJGIGACcglG6TUE1ueUI4gATnB4H4NkE2qBQho1IR0n10gDQRovBoYgkEjFPhCxqCYmpgRDNANgVCcndHIViutmqjngh3p8gb81GpBGoEsDNKMvKDLOdoTMnEVIKVcJzHlt0YYhb99gMzJ9oljBEk0mlMrKWTDZor5tdkVyntsEGZQdiYoJgQY1HqjrzBOlxmcgA */
  return createMachine(
    {
      id: "checkbox",
      tsTypes: {} as import("./checkbox.machine.typegen").Typegen0,
      schema: {} as {
        context: Context;
        events:
          | { type: "TOGGLE" }
          | { type: "SET_SELECTED"; value: boolean }
          | { type: "SYNC_PUBLIC_CONTEXT"; value: Partial<UserDefinedContext> };
      },

      context: {
        ...ctx,
        indeterminate: false,
        disabled: false,
        readonly: false,
      },

      on: {
        SYNC_PUBLIC_CONTEXT: {
          actions: assign((_, event) => {
            return {
              ...event.value,
            };
          }),
        },
      },

      states: {
        selected: {
          initial: "no",
          on: {
            SET_SELECTED: [
              {
                cond: "shouldSelect",
                target: ".yes",
              },
              {
                target: ".no",
              },
            ],
          },
          states: {
            no: {
              on: {
                TOGGLE: {
                  cond: "isInteractive",
                  target: "yes",
                },
              },
            },
            yes: {
              on: {
                TOGGLE: {
                  cond: "isInteractive",
                  target: "no",
                },
              },
            },
          },
        },
      },
      type: "parallel",
    },
    {
      guards: {
        isInteractive: (context) => !context.disabled && !context.readonly,
        shouldSelect: (_, event) => {
          return event.value;
        },
      },
    },
  );
}
