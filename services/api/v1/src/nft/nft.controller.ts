/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get(':contractAddress/:tokenId')
  getNftDetails(@Param('contractAddress') contractAddress: string, @Param('tokenId') tokenId: string): Promise<string> {
    return this.nftService.getNftDetails(contractAddress, tokenId);
  }
}
