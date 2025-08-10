/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import web3 from 'web3';

const address = '0xbccb4e1aeb3ac505783b9c744d4623ebd1467561';
const contractAddress = '0x670Ec3544786843b9B207cC274968e2B58489fF1';

const TransactionHash = () => {
  const MethodId = () => {
    // Your openBox function signature from the ABI
    const functionSignature = 'openBox(address[],uint256[],bytes)';
    const methodId = web3.utils.keccak256(functionSignature).slice(0, 10);
    return methodId;
  };

  const getLatestOpenBoxTransaction = async () => {
    const API_KEY = 'R77H27MWUSI5JAWSX7GAZ69QXFNP763KCN';
    const baseURL = 'https://api.etherscan.io/api';
    const openBoxMethodId = MethodId();

    try {
      const response = await fetch(
        `${baseURL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${API_KEY}`
      );

      const data = await response.json();

      if (data.status === '1') {
        // Find the first transaction that matches openBox method
        for (const tx of data.result) {
          // Filter by contract address if specified
          if (contractAddress && tx.to?.toLowerCase() !== contractAddress.toLowerCase()) {
            continue;
          }

          // Check if transaction calls openBox method
          if (tx.input && tx.input.startsWith(openBoxMethodId)) {
            return {
              transactionHash: tx.hash,
            };
          }
        }

        return null; // No openBox transaction found
      } else {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching latest openBox transaction:', error);
      throw error;
    }
  };

  const pathname = usePathname();
  useEffect(() => {
    (async () => {
      if (MethodId()) {
        console.log(await getLatestOpenBoxTransaction()); ;
      }
    })();
  }, [pathname]);
  return undefined;
};

export default TransactionHash;
