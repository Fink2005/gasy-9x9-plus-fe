export type User = {
  address: string;
  history: string[];
  isKyc: boolean;
  score: string;
  updatedAt: string | null;
  _id: string;
};

export type UserRanking = {
  users: {
    _id: string;
    address: string;
    score: string;
    name: string;
  }[];
};

export type UserScore = {
  users: {
    address: string;
    score: string;
    email: string;
  };
};

export type UserGetMe = {
  _id: string;
  address: string;
  invitedBy: string;
  inviterChain: string[];
  isKyc: boolean;
  score: number;
  restTimes: number;
  lastUpdatedTime: number;
  amount: number;
  openBoxHistories: any[]; // You can replace `any` with a specific type if you have one
  createdAt: string;
  updatedAt: string | null;
  _destroy: boolean;
  email: string;
  openedBox: number;
};
