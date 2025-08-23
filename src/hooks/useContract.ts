import { ethers } from 'ethers';

import { CONTRACT_CONFIG } from '../config/contract';
import toast from 'react-hot-toast';

export const useContract = () => {
  // Wallet connection logic removed. You must provide a signer explicitly.
  const getContract = (providerOrSigner: any) => {
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, providerOrSigner);
  };

  const createProduct = async (providerOrSigner: any, name: string, quantity: string | number, harvestDate: string | number) => {
    try {
      const contract = getContract(providerOrSigner);
      // Convert quantity and harvestDate to numbers if needed
      const tx = await contract.createProduct(name, Number(quantity), Number(harvestDate));
      toast.loading('Creating product...', { id: 'create-product' });
      await tx.wait();
      toast.success('Product created successfully!', { id: 'create-product' });
      return true;
    } catch (error: any) {
      let message = 'Failed to create product';
      if (error?.reason) message += `: ${error.reason}`;
      if (error?.data?.message) message += `: ${error.data.message}`;
      if (error?.message) message += `: ${error.message}`;
      console.error('Error creating product:', error);
      toast.error(message, { id: 'create-product' });
      throw error;
    }
  };

  const addUpdate = async (providerOrSigner: any, productId: string, status: string, iotData: string) => {
    try {
      const contract = getContract(providerOrSigner);
      // Do NOT pass gas, gasPrice, maxFeePerGas, or maxPriorityFeePerGas manually; let ethers.js/provider handle it
      const tx = await contract.addUpdate(productId, status, iotData);
      toast.loading('Adding update...', { id: 'add-update' });
      await tx.wait();
      toast.success('Update added successfully!', { id: 'add-update' });
      return true;
    } catch (error: any) {
      let message = 'Failed to add update';
      if (error?.reason) message += `: ${error.reason}`;
      if (error?.data?.message) message += `: ${error.data.message}`;
      if (error?.message) message += `: ${error.message}`;
      console.error('Error adding update:', error);
      toast.error(message, { id: 'add-update' });
      throw error;
    }
  };

  const getProductHistory = async (providerOrSigner: any, productId: string) => {
    try {
      const contract = getContract(providerOrSigner);
      const history = await contract.getProductHistory(productId);
      // Defensive: contract returns only id, name, quantity, harvestDate, owner
      return {
        id: history.id?.toString?.() ?? '',
        name: history.name,
        quantity: history.quantity?.toString?.() ?? '',
        harvestDate: history.harvestDate ? new Date(Number(history.harvestDate) * 1000) : null,
        statuses: [],
        iotData: [],
        timestamps: [],
      };
    } catch (error: any) {
      let message = 'Failed to fetch product history';
      if (error?.reason) message += `: ${error.reason}`;
      if (error?.data?.message) message += `: ${error.data.message}`;
      if (error?.message) message += `: ${error.message}`;
      console.error('Error fetching product history:', error);
      toast.error(message);
      throw error;
    }
  };

  const getProductsByOwner = async (providerOrSigner: any, ownerAddress: string) => {
    try {
      const contract = getContract(providerOrSigner);
      const productIds = await contract.getProductsByOwner(ownerAddress);
      return Array.isArray(productIds)
        ? productIds.map((id: any) => id?.toString?.() ?? '')
        : [];
    } catch (error: any) {
      let message = 'Failed to fetch products';
      if (error?.reason) message += `: ${error.reason}`;
      if (error?.data?.message) message += `: ${error.data.message}`;
      if (error?.message) message += `: ${error.message}`;
      console.error('Error fetching products by owner:', error);
      toast.error(message);
      throw error;
    }
  };

  return {
    createProduct,
    addUpdate,
    getProductHistory,
    getProductsByOwner,
  };
};