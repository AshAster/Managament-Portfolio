import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

// Types for MetaMask (window.ethereum)
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string }) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Styled components
const SignInButton = styled.button`
  background: #3ccf91;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: #34b57d;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #2a8a65;
    cursor: not-allowed;
  }
`;

const WalletModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1f2026;
  padding: 32px;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid #2d2e33;
`;

const ModalHeader = styled.h2`
  margin: 0 0 24px 0;
  color: white;
  font-size: 24px;
  text-align: center;
`;

const WalletOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  background: #25262c;
  transition: all 0.2s ease;
`;

const WalletIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
`;

const WalletName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
`;

const WalletDescription = styled.p`
  color: #a0a0a0;
  font-size: 14px;
  text-align: center;
  margin: 10px 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: #2d2e33;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3ccf91;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 2px;
    background: white;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const StatusMessage = styled.div`
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  background: #25262c;
  color: #3ccf91;
  text-align: center;
  font-size: 14px;
`;

const ErrorMessage = styled(StatusMessage)`
  color: #ff6b6b;
`;

const META_MASK = {
  name: 'MetaMask',
  icon: 'https://cdn.iconscout.com/icon/free/png-256/free-metamask-2728406-2261817.png',
  description: 'Connect with your MetaMask wallet to sign in and access the platform'
};

type WalletConnectionProps = {
  onConnect: (address: string, provider: ethers.providers.Web3Provider) => void;
  onDisconnect: () => void;
  showModal: boolean;
  onCloseModal: () => void;
};

const WalletConnection = ({
  onConnect,
  onDisconnect,
  showModal,
  onCloseModal
}: WalletConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (showModal) {
      setError('');
      setStatusMessage('');
      setIsSigningIn(false);
      checkWalletConnection();
    }
  }, [showModal]);

  useEffect(() => {
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async (): Promise<void> => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          handleConnection(accounts[0], provider);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    }
  };

  const handleSignIn = async (): Promise<void> => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }

    setIsSigningIn(true);
    setStatusMessage('Please confirm the connection in your MetaMask...');
    setError('');

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        handleConnection(accounts[0], provider);
        setStatusMessage('Connection successful!');
      }
    } catch (err: any) {
      console.error('Error connecting to MetaMask:', err);
      if (err.code === 4001) {
        setError('User rejected the connection request.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
      setTimeout(onCloseModal, 1500);
    }
  };

  const handleConnection = (address: string, provider: ethers.providers.Web3Provider): void => {
    setUserAddress(address);
    setIsConnected(true);
    onConnect(address, provider);
  };

  const handleDisconnect = (): void => {
    setIsConnected(false);
    setUserAddress('');
    onDisconnect();
  };

  const handleAccountsChanged = (accounts: string[]): void => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum!);
      handleConnection(accounts[0], provider);
    }
  };

  const handleChainChanged = (): void => {
    window.location.reload();
  };

  return (
    <>
      {showModal && (
        <WalletModal>
          <ModalContent>
            <CloseButton onClick={onCloseModal} />
            <ModalHeader>Sign In With MetaMask</ModalHeader>

            <WalletOption>
              <WalletIcon src={META_MASK.icon} alt={META_MASK.name} />
              <WalletName>{META_MASK.name}</WalletName>
              <WalletDescription>{META_MASK.description}</WalletDescription>

              <SignInButton
                onClick={handleSignIn}
                disabled={isSigningIn}
              >
                {isSigningIn ? 'Waiting for Signature...' : 'Sign In to Connect'}
              </SignInButton>
            </WalletOption>

            {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </ModalContent>
        </WalletModal>
      )}
    </>
  );
};

export default WalletConnection;
