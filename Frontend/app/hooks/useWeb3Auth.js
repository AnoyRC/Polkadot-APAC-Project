"use client"
import { useState, useEffect } from "react"
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { CommonPrivateKeyProvider } from "@web3auth/base-provider"
import {
    initiateOnboarding,
    setEvmAddress,
    setPolkadotAddress,
    setProvider
} from "@/redux/defaultSlice";
import { useDispatch, useSelector } from "react-redux"
import RPC from "../../utils/polkadotRPC"
import { calculateMultilocation } from "@/utils/calculate-multilocation";
import { clientId } from "@/utils/constants"

//const clientId = "BHU28_3aSDIzfxbmGoAxn8D8X3Dctu1qZiCN12N_ztH_rgSjZJK1FasQiyqYRxiYIpjP1O6g3FgOTCQ3BQRnlgE"


export function useWeb3Auth() {
    const dispatch = useDispatch()
    const [web3auth, setWeb3auth] = useState(null)
    const provider = useSelector((state) => state.default.provider)
    const polkadotAddress = useSelector((state) => state.default.polkadotAddress)
    
    //Initialize Web3 Auth

    useEffect(() => {
        const evmAddress = createEVMAddress(polkadotAddress)
        dispatch(setEvmAddress(evmAddress))
    }, [polkadotAddress])

    //Create the EVM address from given Polkadot address
    const createEVMAddress = async (polkadotAddress) => {
        if (polkadotAddress) {
            //console.log(await polkadotAddress)
            const multiLocation = await calculateMultilocation(await polkadotAddress)
            dispatch(setEvmAddress(multiLocation))
        }
    }

    const initializeWeb3Auth = async () => {
        try {
            const chainConfig = {
                chainNamespace: CHAIN_NAMESPACES.OTHER,
                chainId: "0x1",
                rpcTarget: "https://rpc.polkadot.io/",
                displayName: "Polkadot Mainnet",
                blockExplorer: "https://explorer.polkascan.io/",
                ticker: "DOT",
                tickerName: "Polkadot",
            }
            const web3authInstance = new Web3AuthNoModal({
                clientId,
                chainConfig,
                web3AuthNetwork: "aqua",
            });

            setWeb3auth(web3authInstance)

            const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });
            const openloginAdapter = new OpenloginAdapter({
                privateKeyProvider,
            });
            web3authInstance.configureAdapter(openloginAdapter);
            await web3authInstance.init();

            dispatch(setProvider(web3authInstance.provider));

            console.log("Done")

        } catch (error) {
            console.error(error)
        }
    }
    //Login with email to create POLKADOT address
    const loginWithEmail = async ({ email }) => {
        if (!web3auth || email.length === 0) {
            console.log("Web3Auth Not Initialized")
            return
        }
        try {
            const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
                loginProvider: "email_passwordless",
                extraLoginOptions: {
                    login_hint: email,
                }
            })
            dispatch(setProvider(web3authProvider))
            const polkadotAddress = await getAccounts()
            dispatch(setPolkadotAddress(polkadotAddress))

        } catch (error) {
            if (error.message === "Failed to connect with wallet. Already connected") {

                const polkadotAddress = await getAccounts()
                dispatch(setPolkadotAddress(polkadotAddress))

            }
            else
                console.log("Some Error Occured")
        }
    }
    //Logout
    const logout = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        await web3auth.logout();
        console.log("Logged Out")
    };

    //GetAccounts
    const getAccounts = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            return;
        }
        const rpc = new RPC(provider);
        const userAccount = await rpc.getAccounts();
        console.log("Address", userAccount);
        return userAccount
    };

    //GetUserInfo
    const getUserInfo = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        const user = await web3auth.getUserInfo();
        console.log(user);
    };

    const sendTransactionToCreateProfile=async(xcmCallData)=>{
        if(!provider){
            console.log("provider not initialized yet");
            return;
        }
        const rpc=new RPC(provider)
        const keyPair=await rpc.getPolkadotKeyPair()
        const api=await rpc.makeClient()
        const tx= await api.tx(xcmCallData).signAndSend(keyPair)
        console.log(tx)
    }

    return {
        initializeWeb3Auth,
        loginWithEmail,
        getAccounts,
        logout,
        getUserInfo,
        sendTransactionToCreateProfile
    }
}