// file objectに関する型定義
export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

// authSlice.ts
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}
