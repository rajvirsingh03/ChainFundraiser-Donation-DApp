import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useContractWrite,
  useMetamask,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xdfC893Bb79a280DCDdBA71d36642E0eA122Feb43"
  );
  //we have 2 functions that can be used to interact with the contract(WRITE)
  //createCampaign && donateToCampaign

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();
  // const metamaskConfig = metamaskWallet();
  // const connect = useConnect(metamaskConfig);

  // function address() {
  //   const Address = useAddress();
  // }

  // async function connect() {
  //   const wallet = new MetaMaskWallet();
  //   console.log("Connecting to metamask");
  //   try {
  //     await wallet.connect();
  //     console.log("Connected");
  //   } catch (error) {
  //     console.log("failed to connect");
  //   }
  // }

  // async function connect() {
  //   const metamaskConfig = metamaskWallet();
  //   const connect = useConnect();
  //   const wallet = await connect(metamaskConfig, connectOptions);
  // }

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, //owner(creator)
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });

      console.log("Contract Call Success", data);
    } catch (error) {
      console.log("Contract Call Failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));
    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCmapaigns = await getCampaigns();
    const filteredCampaigns = allCmapaigns.filter(
      (campaign) => campaign.owner === address
    );
    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
