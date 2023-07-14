"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useDispatch,useSelector } from "react-redux";
import {
  initiateOnboarding,
  setEvmAddress,
  setPolkadotAddress,
} from "@/redux/defaultSlice";
import { useWeb3Auth } from "@/app/hooks";
import { Input } from "@/components/ui/input";
import { Wallet2 } from "lucide-react";
import { calculateMultilocation } from "@/utils/calculate-multilocation";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES,WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import RPC from "../../../utils/polkadotRPC"

const clientId="BHU28_3aSDIzfxbmGoAxn8D8X3Dctu1qZiCN12N_ztH_rgSjZJK1FasQiyqYRxiYIpjP1O6g3FgOTCQ3BQRnlgE"

const ConnectSection = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState();
  const polkadotAddress = useSelector((state) => state.default.polkadotAddress);
  const {initializeWeb3Auth,loginWithEmail,getAccounts,logout,getUserInfo}=useWeb3Auth()

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(initiateOnboarding());
    }, 1000);
  };

  React.useEffect(()=>{
    
    initializeWeb3Auth()
  
  },[])
  

  //Implementing loginWithEmail Hook
  const emailLogin=async()=>{
    try {
      setIsLoading(true)
      await loginWithEmail({email:email})
      setTimeout(createEVMAddress,200)
    } catch (error) {
      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }

  const createEVMAddress=async()=>{
    if(polkadotAddress){
      //console.log(await polkadotAddress)
      const multiLocation = await calculateMultilocation(await polkadotAddress)
      dispatch(setEvmAddress(multiLocation))
    }
  }
  
  return (
    <div className="relative bg-black">
      {/* Connect Section */}
      <div className="absolute top-0 right-0">
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 text-white hover:bg-black hover:text-gray-300"
          )}
        >
          Connect
        </Link>
      </div>

      {/* Connect Dialog */}
      <div className="mx-auto flex w-full h-full flex-col justify-center items-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Connect a wallet
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to get started.
          </p>
        </div>

        {/* Connect with Email */}
        <div className="flex flex-col space-y-2 mt-5">
          <Input
            type="text"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ring-offset-gray-900 text-black focus-visible:ring-gray-600 border-gray-500 bg-white w-[300px]"
          />
        </div>
        <Button
          disabled={isLoading}
          className="bg-white text-black hover:bg-gray-300 hover:text-black w-[300px]"
          onClick={emailLogin}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In with Email
        </Button>

        <div className="relative  w-[300px]">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Connect with Wallet */}
        <Button
          disabled={isLoading}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-transparent text-white hover:bg-zinc-900 hover:text-white w-[300px]"
          )}
          onClick={handleConnect}
        >
          {(isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )) || <Wallet2 size={14} className="mr-2 h-4 w-4" />}
          Connect
        </Button>
        
        <Button
          disabled={isLoading}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-transparent text-white hover:bg-zinc-900 hover:text-white w-[300px]"
          )}
          onClick={logout}
        >
          Logout
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By connecting your wallet, you agree to our{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-gray-300"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-gray-300"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default ConnectSection;
