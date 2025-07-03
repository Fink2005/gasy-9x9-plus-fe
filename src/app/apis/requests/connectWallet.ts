import apiRequest from '@/app/apis/apiRequest';

const connectWalletRequest = {
  async getNonce(value: string): Promise<{ nonce: string } | null> {
    return await apiRequest<{ nonce: string }>(`/auth/nonce/${value}`, 'GET');
  }
};
export default connectWalletRequest;
