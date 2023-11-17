/// <reference types="next" />
/// <reference types="next/types/global" />

// 扩展环境变量类型
declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    NEXTAUTH_SECRET: string;
    WHITELIST_EMAILS: string;
  }
}
