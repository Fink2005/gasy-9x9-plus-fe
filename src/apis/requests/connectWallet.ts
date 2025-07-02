import apiRequest from '@/apis/apiRequest';

const connectWallet = {
  async getNonce(value: string) {
    apiRequest(`/auth/nonce/${value}`, 'GET');
  }
};
export default connectWallet;
