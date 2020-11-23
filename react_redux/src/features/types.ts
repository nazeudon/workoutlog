// file objectに関する型定義
export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

// authSlice
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}

export interface PROPS_USERNAME {
  userName: string;
}

// eventSlice
export interface PROPS_NEWEVENT {
  title: string;
  img: File | null;
}

export interface PROPS_EVENT {
  eventId: number;
  title: string;
  userEvent: number;
  imageUrl: string;
}

// logSlice
export interface PROPS_LOG {
  logId: number;
  userLog: number;
  created_on: string;
  event: number;
}

export interface PROPS_NEWLOG {
  event: number;
}

// detailSlice
export interface PROPS_NEWDETAIL {
  weight: number;
  times: number;
  log: number;
}

export interface PROPS_DETAIL {
  index: number;
  detailId: number;
  weight: number;
  times: number;
  userDetail: number;
  log: number;
}
