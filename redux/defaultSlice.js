import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  polkadotAddress: null,
  evmAddress: null,
  onBoardingStep: 0,
  currentTab: "feed",
  web3Auth: null,
  provider: null,
};

export const defaultSlice = createSlice({
  name: "default",
  initialState,
  reducers: {
    setPolkadotAddress: (state, action) => {
      state.polkadotAddress = action.payload;
    },
    setEvmAddress: (state, action) => {
      state.evmAddress = action.payload;
    },
    setWeb3Auth: (state, action) => {
      state.web3Auth = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    initiateOnboarding: (state) => {
      state.onBoardingStep = 1;
    },
    previousOnboardingStep: (state) => {
      if (state.onBoardingStep > 1)
        state.onBoardingStep = state.onBoardingStep - 1;
    },
    nextOnboardingStep: (state) => {
      if (state.onBoardingStep < 3)
        state.onBoardingStep = state.onBoardingStep + 1;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});

export const {
  setPolkadotAddress,
  setEvmAddress,
  setWeb3Auth,
  setProvider,
  initiateOnboarding,
  previousOnboardingStep,
  nextOnboardingStep,
  setCurrentTab,
} = defaultSlice.actions;
