/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { HttpProviderOptions } from 'web3-core-helpers';

@Injectable()
export class NftService {
  private web3: Web3;

  constructor() {
    const rpc_url_prefix = process.env.RPC_URL_PREFIX;
    const projectId = process.env.INFURA_PROJECT_ID;
    const projectSecret = process.env.INFURA_PROJECT_SECRET;
    const authHeader = `Basic ${Buffer.from(
      `${projectId}:${projectSecret}`,
    ).toString('base64')}`;

    const options: HttpProviderOptions = {
      headers: [{ name: 'Authorization', value: authHeader }],
    };

    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        `${rpc_url_prefix}/${projectId}`,
        options,
      ),
    );
  }

  async getNftDetails(contractAddress: string, tokenId: string): Promise<string> {
    const minABI = [
      {
        inputs: [{ name: '_tokenId', type: 'uint256' }],
        outputs: [{ name: 'uri', type: 'string' }],
        name: 'tokenURI',
        type: 'function',
        constant: true,
      },
    ] as const;

    const contract = new this.web3.eth.Contract(minABI, contractAddress);

    try {
      const uri: string = await contract.methods.tokenURI(tokenId).call();
      return uri; // Return the URI or further process to extract metadata
    } catch (error) {
      console.error(error);
      throw new Error('Unable to fetch NFT details.');
    }
  }
}
