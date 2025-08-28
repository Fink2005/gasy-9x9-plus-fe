import { createCookie, deleteCookie } from '@/app/actions/cookie';
import { handleRevalidateTag } from '@/app/actions/revalidation';
import { ApiException } from '@/app/http/apiRequest';
import { boxRequest } from '@/app/http/requests/box';
import BoxDistributor from '@/contracts/BoxDistributor.json';
import { delay } from '@/libs/utils';
import { toast } from 'sonner';
import Web3 from 'web3';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type BoxRetryType = {
  currentBox?: number | undefined;
  isConfirmed?: boolean | undefined;
  txHash?: string | undefined;
};

type StoreState = {
  // State
  loadingItems: {
    [boxNumber: number]: boolean;
  };

  isOpen: boolean;

  boxRetry: BoxRetryType;
  // Actions
  setLoading: (loading: boolean, boxNumber: number) => void;
  handleOpenBox: ({
    currentBox,
    isConfirmed,
    txHash
  }: BoxRetryType) => Promise<boolean | undefined>;
  clearBox: () => void;

  setIsOpen: (isOpen: boolean) => void;
};

const usdtAbi = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  }
];

const usdtAddress = '0xc1Be51dc3872f33d8AD2847adeadEF1061DD480B'; // this is for Sepolia testnet USDT
const contractAddress = '0x6c1175baCC46BB85884Cb287485d3469dBAfeD65';
const approveAmount = 26 * 10 ** 18; // 26 USDT (18 decimals)

const useBoxStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
      // Initial state
        loadingItems: {},
        boxRetry: {
          currentBox: 0,
          isConfirmed: false,
          txHash: undefined,
        },
        isOpen: false,
        setLoading: (isLoading: boolean, boxNumber: number) => set({ loadingItems: {
          [boxNumber]: isLoading,
        } }),

        handleOpenBox: async ({ currentBox, isConfirmed, txHash }: BoxRetryType) => {
          const state = get();
          state.setLoading(true, currentBox as number);
          if (isConfirmed) {
            createCookie({
              name: 'boxData',
              value: JSON.stringify({
                isConfirmed,
                currentBox
              })
            });
          }
          set({
            boxRetry: {
              currentBox: currentBox ?? state.boxRetry.currentBox,
              isConfirmed: isConfirmed ?? state.boxRetry.isConfirmed,
              txHash: txHash ?? state.boxRetry.txHash,
            }
          });
          const web3 = new Web3(window.ethereum);

          if (typeof window.ethereum === 'undefined') {
            toast.error('Vui lòng cài đặt ví');
            return false;
          }

          // switch to BSC testnet
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x61' }],
            });

            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];
            const usdtContract = new web3.eth.Contract(usdtAbi as any, usdtAddress);

            if (usdtContract.methods.approve) {
              let hax;

              if (!txHash) {
                hax = await usdtContract.methods.approve(contractAddress, approveAmount).send({ from: sender });
              }

              const transactionHash = hax?.transactionHash || txHash;
              // eslint-disable-next-line no-console
              console.log(hax?.transactionHash, txHash);

              if (!transactionHash) {
                toast.error('Giao dịch thất bại vui lòng liên hệ admin.');
                return false;
              }

              await delay(5000);

              const res = await boxRequest.boxApprove((transactionHash as string), currentBox as number);

              if (!res) {
                throw new Error('Box approval failed');
              }
              const { signature, addresses, amounts } = res;

              const amountsFormated = amounts.map(amount => BigInt(amount));

              // Encode data cho openBox
              const parsed = JSON.parse(JSON.stringify(BoxDistributor));
              const contract = new web3.eth.Contract(parsed, contractAddress);

              const data = contract.methods.openBox!(
                addresses,
                amountsFormated,
                signature
              ).encodeABI();

              const gasLimit = await web3.eth.estimateGas({
                to: contractAddress,
                data,
                from: sender
              });

              // Lấy gas price
              const gasPrice = await web3.eth.getGasPrice();
              // Tạo transaction object
              const txObject = {
                to: contractAddress,
                data,
                gas: gasLimit, // ✅ Use estimated gas limit
                gasPrice, // ✅ Use gas price separately
                from: sender
              };

              const response = await web3.eth.sendTransaction({
                ...txObject,
                from: sender
              });
              // alert(response.transactionHash);

              const receiptRes = await web3.eth.getTransactionReceipt(response.transactionHash);

              if (receiptRes.status) {
                await boxRequest.boxOpen(response.transactionHash as string);
                set({
                  isOpen: true
                });
                toast.success('Mở box thành công!');
                handleRevalidateTag('get-me');

                state.clearBox();
                state.setLoading(false, currentBox as number);
                await deleteCookie('boxData');
              } else {
                toast.error('Giao dịch thất bại hoặc bị huỷ.');
                return false;
              }
              return true;
            }
            return false;
          } catch (err) {
            toast.error('Đã xảy ra lỗi, vui lòng thử lại.');
            state.clearBox();
            await deleteCookie('boxData');
            console.error('Error during box opening:', err);
            state.setLoading(false, currentBox as number);
            throw new ApiException('Error during box opening', 500);
          }
        },

        setIsOpen: async (isOpen: boolean) => {
          set({ isOpen });
        },

        clearBox: () => set({ boxRetry: {
          currentBox: undefined,
          isConfirmed: undefined,
          txHash: undefined
        } }),

      }),
      {
        partialize: (state) => {
          const { isOpen, ...rest } = state;
          return rest;
        },
        name: 'box-storage', // Name of the storage (must be unique)
      }
    )
  )
);

export default useBoxStore;
