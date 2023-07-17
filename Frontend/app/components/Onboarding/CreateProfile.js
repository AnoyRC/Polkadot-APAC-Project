"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, subYears } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { previousOnboardingStep } from "@/redux/defaultSlice";
import { initializeUser } from "@/app/hooks/initializeUserXCM";
import { saveToIPFS } from "@/app/hooks/saveToIPFS";
import { WsProvider, ApiPromise } from "@polkadot/api";
import RPC from "../../../utils/polkadotRPC";

const CreateProfile = () => {
  const [name, setName] = React.useState();
  const [bio, setBio] = React.useState();
  const [date, setDate] = React.useState();
  const [avatar, setAvatar] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const maxDate = subYears(new Date(), 18);
  const dispatch = useDispatch();
  const evmAddress = useSelector((state) => state.default.evmAddress);
  const polkadotAddress = useSelector((state) => state.default.polkadotAddress);
  const provider = useSelector((state) => state.default.provider);

  const createProfile = async () => {
    const { web3Enable, web3FromAddress } = await import(
      "@polkadot/extension-dapp"
    );
    if (!name || !bio || !date || !avatar) window.alert("Fill all fields");
    else {
      const cid = await saveToIPFS(avatar);
      const unixDate = parseInt(date.getTime() / 1000);
      const providerWsURL =
        "wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network";
      const substrateProvider = new WsProvider(providerWsURL);
      const api = await ApiPromise.create({ provider: substrateProvider });
      const xcmCallData = await initializeUser(
        evmAddress,
        name,
        cid,
        bio,
        unixDate
      );
      const extension = await web3Enable("dotUser");
      const injector = await web3FromAddress(polkadotAddress);

      const tx = await api
        .tx(xcmCallData)
        .signAndSend(
          polkadotAddress,
          { signer: injector.signer },
          ({ result }) => {
            console.log(`Transaction Sent`);
            if (Result.status.isInBlock) {
              console.log(
                `Transaction include in blockhash ${result.status.asInBlock}`
              );
            }
          }
        );
    }
  };

  const createProfileWithWeb3Auth = async () => {
    if (!name || !bio || !date || !avatar) window.alert("Fill all fields");
    else {
      const cid = await saveToIPFS(avatar);
      const unixDate = parseInt(date.getTime() / 1000);
      const xcmCallData = await initializeUser(
        evmAddress,
        name,
        cid,
        bio,
        unixDate
      );
      console.log(xcmCallData);
      const rpc = new RPC(provider);
      const keyPair = await rpc.getPolkadotKeyPair();
      const api = await rpc.makeClient();
      const tx = await api.tx(xcmCallData).signAndSend(keyPair);
      console.log(tx);
    }
  };

  return (
    <div className="bg-black relative flex-col justify-center items-center flex">
      <div className="px-20 flex flex-col justify-center">
        {/* Create Profile Section */}
        <div className="absolute top-0 right-0">
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-8 top-8 text-white hover:bg-black hover:text-gray-300 w-[120px]"
            )}
          >
            Step 3 of 3
          </Link>
        </div>

        <div className="flex flex-col space-y-2">
          {/* Create Profile Header */}
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Create a profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a profile to get started.
          </p>
        </div>

        {/* Name */}
        <div className="flex flex-col space-y-2 mt-5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Name
          </h1>
          <Input
            type="text"
            placeholder="Anoy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ring-offset-gray-900 text-black focus-visible:ring-gray-600 border-gray-500 bg-white w-[400px]"
          />
          <p className="text-sm text-muted-foreground">
            This is your profile diplay name.
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col space-y-2 mt-5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Date of birth
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[400px] justify-start text-left font-normal bg-white text-black",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                classNames={{
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-white/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  caption_label: "hidden",
                  caption_dropdowns:
                    "flex w-full items-center justify-center space-x-2",
                }}
                mode="single"
                selected={date}
                fromDate={subYears(new Date(), 100)}
                toDate={maxDate}
                captionLayout="dropdown"
                onSelect={setDate}
                defaultMonth={
                  new Date(
                    date?.getFullYear() ?? maxDate.getFullYear(),
                    date?.getMonth() ?? maxDate.getMonth(),
                    1
                  )
                }
                required
                initialFocus
                className="border rounded-md border-white/10"
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground">
            Your age will be determined by this date.
          </p>
        </div>

        {/* Bio */}
        <div className="flex flex-col space-y-2 mt-5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Description
          </h1>
          <Textarea
            placeholder="I own a computer."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="ring-offset-gray-900 text-black focus-visible:ring-gray-600 border-gray-500 bg-white w-[400px]"
          />
          <p className="text-sm text-muted-foreground">
            This is your profile description.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col space-y-2 mt-5">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Avatar
          </h1>
          <div className="flex items-center space-x-2">
            <Avatar>
              {avatar && <AvatarImage src={URL.createObjectURL(avatar)} />}
              <AvatarFallback>
                {name && name.length > 1 ? name.substring(0, 2) : "AV"}
              </AvatarFallback>
            </Avatar>
            <Input
              id="picture"
              type="file"
              onChange={(e) => {
                if (!e.target.files) return;
                setAvatar(e.target.files[0]);
                console.log(e.target.files[0].type);
              }}
              className="ring-offset-gray-900 text-black focus-visible:ring-gray-600 border-gray-500 hover:cursor-point"
              placeholder="Choose a File"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            This is your profile diplay Avatar.
          </p>
        </div>

        {/* Create Button & Previous Button */}
        <div className="flex justify-between mt-7">
          <Button
            className={cn(
              buttonVariants({ variant: "outline" }),
              "bg-white text-black hover:bg-gray-300 hover:text-black w-[190px] relative"
            )}
            onClick={() => {
              dispatch(previousOnboardingStep());
            }}
          >
            <ChevronLeft className="absolute left-3 w-4" />
            Previous
          </Button>
          <Button
            disabled={isLoading}
            className="bg-white text-black hover:bg-gray-300 hover:text-black w-[190px]"
            onClick={createProfileWithWeb3Auth}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
