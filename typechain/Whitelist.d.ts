/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface WhitelistInterface extends ethers.utils.Interface {
  functions: {
    "addAddressToWhitelist()": FunctionFragment;
    "maxWhitelistedAddresses()": FunctionFragment;
    "numAddressesWhitelisted()": FunctionFragment;
    "whitelistedAddresses(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addAddressToWhitelist",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxWhitelistedAddresses",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numAddressesWhitelisted",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistedAddresses",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "addAddressToWhitelist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxWhitelistedAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "numAddressesWhitelisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistedAddresses",
    data: BytesLike
  ): Result;

  events: {};
}

export class Whitelist extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: WhitelistInterface;

  functions: {
    addAddressToWhitelist(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    maxWhitelistedAddresses(overrides?: CallOverrides): Promise<[number]>;

    numAddressesWhitelisted(overrides?: CallOverrides): Promise<[number]>;

    whitelistedAddresses(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  addAddressToWhitelist(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  maxWhitelistedAddresses(overrides?: CallOverrides): Promise<number>;

  numAddressesWhitelisted(overrides?: CallOverrides): Promise<number>;

  whitelistedAddresses(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    addAddressToWhitelist(overrides?: CallOverrides): Promise<void>;

    maxWhitelistedAddresses(overrides?: CallOverrides): Promise<number>;

    numAddressesWhitelisted(overrides?: CallOverrides): Promise<number>;

    whitelistedAddresses(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    addAddressToWhitelist(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    maxWhitelistedAddresses(overrides?: CallOverrides): Promise<BigNumber>;

    numAddressesWhitelisted(overrides?: CallOverrides): Promise<BigNumber>;

    whitelistedAddresses(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addAddressToWhitelist(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    maxWhitelistedAddresses(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numAddressesWhitelisted(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    whitelistedAddresses(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
