declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_TOKEN: string;
    DATABASE_URL: string;
    REDDIT_USERNAME: string;
    REDDIT_PASSWORD: string;
    REDDIT_APP_ID: string;
    REDDIT_APP_SECRET: string;
  }
}

// fix for type error in snoowrap
// eslint-disable-next-line
import ReadableStream = NodeJS.ReadableStream;
