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

type BoxHistoryItems = {
  boxNumber: number;
  open: boolean;
  time: Date;
  title: string;
  description: string;

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
  openBoxHistories: BoxHistoryItems[];
  createdAt: string;
  updatedAt: string | null;
  _destroy: boolean;
  email: string;
  openedBox: number;
};
