import {
  pino,
  stdTimeFunctions,
  transport,
  type DestinationStream,
} from "pino";

// NOTE: Pino logs synchronously by default. That's probably why
// request logs are not showing up in the console instantly.
const pinoTransport = transport({
  targets: [
    {
      target: "pino-pretty",
      level: "trace",
    },
    {
      target: "pino/file",
      level: "trace",
      options: {
        destination: `${process.cwd()}/logs/main.log`,
        mkdir: true,
      },
    },
    {
      target: "pino/file",
      level: "error",
      options: {
        destination: `${process.cwd()}/logs/error.log`,
        mkdir: true,
      },
    },
  ],
});

export const log = pino(
  {
    timestamp: stdTimeFunctions.isoTime,
    level: "trace",
  },
  pinoTransport as DestinationStream
);
