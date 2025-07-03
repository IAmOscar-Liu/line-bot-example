declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINE_CHANNEL_SECRET: string;
      LINE_CHANNEL_ACCESS_TOKEN: string;
    }
  }
}

export {}
