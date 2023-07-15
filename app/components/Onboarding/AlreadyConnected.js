import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Wallet2 } from "lucide-react";
import { nextOnboardingStep } from "@/redux/defaultSlice";
import { useDispatch,useSelector } from "react-redux";
import { ethers } from "ethers";

const dotComUser="0x444a911808D18E17Bf4D7eB44Aa4dee09c605248"
let ABI = [
  "function addressToId(address) public view returns (uint256)",
  "function idToUser(uint256) public view returns (uint256,string,address,string,string,uint256)"
]

const AlreadyConnected = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const evmAddress=useSelector((state)=>state.default.evmAddress)

  const getProfile=async()=>{
    const provider =new ethers.providers.JsonRpcProvider('https://rpc.api.moonbase.moonbeam.network')
    const contract=new ethers.Contract(dotComUser,ABI,provider)
    
    const id=await contract.addressToId(evmAddress)
    
    const profile=await contract.idToUser(id)
    console.log(profile)
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
          Connected
        </Link>
      </div>

      {/* Connect Dialog */}
      <div className="mx-auto flex w-full h-full flex-col justify-center items-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Wallet Connected
          </h1>
          <p className="text-sm text-muted-foreground">
            Your wallet is now connected, <br /> proceed to the next step.
          </p>
        </div>

        {/* Connect with Email */}
        <Button
          disabled={isLoading}
          className="bg-white text-black hover:bg-gray-300 hover:text-black w-[300px]"
          onClick={getProfile}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create Profile
        </Button>

        <div className="relative  w-[300px]">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Connect with Wallet */}
        <Button
          disabled={isLoading}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-transparent text-white hover:bg-zinc-900 hover:text-white w-[300px]"
          )}
        >
          {(isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )) || <Wallet2 size={14} className="mr-2 h-4 w-4" />}
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AlreadyConnected;
