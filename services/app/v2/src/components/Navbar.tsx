'use client';

import Link from "next/link";
import Image from "next/image";
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { ConnectionStatus, EventType, ServiceStatus } from '@metamask/sdk-communication-layer';
import { useEffect, useState } from 'react';
import { truncateAddress } from "@/libs/strings";

declare global {
  interface Window {
    ethereum?: SDKProvider;
  }
}

export default function Navbar() {
  const [account, setAccount] = useState<string>();
  const [sdk, setSDK] = useState<MetaMaskSDK>();
  const [chain, setChain] = useState('');
  const [response, setResponse] = useState<any>('');
  const [connected, setConnected] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>();
  const [activeProvider, setActiveProvider] = useState<SDKProvider>();

  useEffect(() => {
    const doAsync = async () => {
      const clientSDK = new MetaMaskSDK({
        useDeeplink: false,
        communicationServerUrl: process.env.NEXT_PUBLIC_COMM_SERVER_URL,
        checkInstallationImmediately: false,
        i18nOptions: {
          enabled: false
        },
        dappMetadata: {
          name: 'NFTCred Dapp',
          url: `https://localhost:${process.env.PORT}`,
        },
        logging: {
          developerMode: true,
        },
        storage: {
          enabled: true,
        },
      });
      await clientSDK.init();
      // console.log(await window.ethereum?.request({method: 'eth_accounts'}));
      setSDK(clientSDK);
    };
    doAsync();
  }, []);

  useEffect(() => {
    if(!sdk || !activeProvider) {
      return;
    }

    // activeProvider is mapped to window.ethereum.
    console.debug(`App::useEffect setup active provider listeners`);
    if (window.ethereum?.getSelectedAddress()) {
      console.debug(`App::useEffect setting account from window.ethereum `);
      setAccount(window.ethereum?.getSelectedAddress() ?? '');
      setConnected(true);
    } else {
      setConnected(false);
    }

    const onChainChanged = (chain: unknown) => {
      console.log(`App::useEfect on 'chainChanged'`, chain);
      setChain(chain as string);
      setConnected(true);
      console.log("onChainChanged.");
    };

    const onInitialized = () => {
      console.log(`App::useEffect onInitialized`);
      setConnected(true);
      if (window.ethereum?.getSelectedAddress()) {
        setAccount(window.ethereum?.getSelectedAddress() ?? '');
      }

      if (window.ethereum?.getChainId()) {
        setChain(window.ethereum.getChainId());
      }
    };

    const onAccountsChanged = (accounts: unknown) => {
      console.log(`App::useEfect on 'accountsChanged'`, accounts);
      setAccount((accounts as string[])?.[0]);
      setConnected(true);
    };

    const onConnect = (_connectInfo: any) => {
      console.log(`App::useEfect on 'connect'`, _connectInfo);
      setConnected(true);
      setChain(_connectInfo.chainId as string);
    };

    const onDisconnect = (error: unknown) => {
      console.log(`App::useEfect on 'disconnect'`, error);
      setConnected(false);
      setChain('');
    };

    const onServiceStatus = (_serviceStatus: ServiceStatus) => {
      console.log(`sdk connection_status`, _serviceStatus);
      setServiceStatus(_serviceStatus);
    };

    window.ethereum?.on('chainChanged', onChainChanged);

    window.ethereum?.on('_initialized', onInitialized);

    window.ethereum?.on('accountsChanged', onAccountsChanged);

    window.ethereum?.on('connect', onConnect);

    window.ethereum?.on('disconnect', onDisconnect);

    sdk.on(EventType.SERVICE_STATUS, onServiceStatus);

    return () => {
      console.debug(`App::useEffect cleanup activeprovider events`);
      window.ethereum?.removeListener('chainChanged', onChainChanged);
      window.ethereum?.removeListener('_initialized', onInitialized);
      window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum?.removeListener('connect', onConnect);
      window.ethereum?.removeListener('disconnect', onDisconnect);
      sdk.removeListener(EventType.SERVICE_STATUS, onServiceStatus);
    }
  }, [activeProvider]);

  useEffect(() => {
    if (!sdk?.isInitialized()) {
      return;
    }

    const onProviderEvent = (accounts?: string[]) => {
      if (accounts?.[0]?.startsWith('0x')) {
        setConnected(true);
        setAccount(accounts?.[0]);
      } else {
        setConnected(false);
        setAccount('');
      }
      setActiveProvider(sdk.getProvider());
    };
    // listen for provider change events
    sdk.on(EventType.PROVIDER_UPDATE, onProviderEvent);
    return () => {
      sdk.removeListener(EventType.PROVIDER_UPDATE, onProviderEvent);
    };
  }, [sdk]);

  const connect = () => {
    if (!window.ethereum) {
      throw new Error(`invalid ethereum provider`);
    }
    window.ethereum
      .request({
        method: 'eth_requestAccounts',
        params: [],
      })
      .then((accounts) => {
        if (accounts) {
          console.log(`connect:: accounts result`, accounts);
          setAccount((accounts as string[])[0]);
          setConnected(true);
        }
      })
      .catch((e) => console.log('request accounts ERR', e));
  };

  return (
    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center mr-8">
        <Image
          src="/nftcred-logo.png"
          alt="NFTCred Logo"
          width={333.96}
          height={80.15}
          priority
        />
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <button onClick={connect} className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl text-center font-semibold">
            {account == '' ? "Connect" : truncateAddress(account as string) }
          </h2>
        </button>
        <Link href="/loans" className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl text-center font-semibold">
            My Loans
          </h2>
        </Link>
        <Link href="/offers" className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl text-center font-semibold">
            My Offers
          </h2>
        </Link>
        <Link href="/offers/world/all" className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl text-center font-semibold">
            World offers
          </h2>
        </Link>
      </div>
    </div>
  );
}
