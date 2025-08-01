export type BoxRes = {
  signature: string;
  addresses: string[];
  amounts: number[];
};

export type BoxDetailRes = {
  invitedCount: number;
  boxNumber: number;
  invitedBy: string;
  directedAmount: number;
  distributedAmount: number;
  referralChainAmount: number;
  receivedTotal: number;
};

export type boxTreeRes = {
  result: {
    users: {
      _id: string;
      address: string;
    }[];
    pagination: {
      totalItems: number;
      limit: number;
      page: number;
      pageTotal: number;
    };
  };
} | null;

export type boxTreeBody = {
  address: string;
  limit: number;
  page: number;
};
