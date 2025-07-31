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
