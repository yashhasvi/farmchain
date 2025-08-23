import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { CONTRACT_CONFIG } from '../config/contract';
import toast from 'react-hot-toast';

export const useContract = () => {
  const { signer, isCorrectNetwork } = useWallet();

  const getContract = () => {
    if (!signer || !isCorrectNetwork) {
      throw new Error('Wallet not connected or wrong network');
    }
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, signer);
  };

  const createProduct = async (name: string, quantity: number, harvestDate: Date) => {
    try {
      const contract = getContract();
      const harvestTimestamp = Math.floor(harvestDate.getTime() / 1000);
      
      const tx = await contract.createProduct(name, quantity, harvestTimestamp);
      toast.loading('Creating product...', { id: 'create-product' });
      
      const receipt = await tx.wait();
      toast.success('Product created successfully!', { id: 'create-product' });
      
      // Extract product ID from the event
      const event = receipt.logs.find((log: any) => log.topics[0] === contract.interface.getEvent('ProductCreated').topicHash);
      if (event) {
        const decodedEvent = contract.interface.decodeEventLog('ProductCreated', event.data, event.topics);
        return decodedEvent.productId.toString();
      }
      
      return null;
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product', { id: 'create-product' });
      throw error;
    }
  };

  const addUpdate = async (productId: string, status: string, iotData: string) => {
    try {
      const contract = getContract();
      const tx = await contract.addUpdate(productId, status, iotData);
      
      toast.loading('Adding update...', { id: 'add-update' });
      await tx.wait();
      toast.success('Update added successfully!', { id: 'add-update' });
      
      return true;
    } catch (error) {
      console.error('Error adding update:', error);
      toast.error('Failed to add update', { id: 'add-update' });
      throw error;
    }
  };

  const getProductHistory = async (productId: string) => {
    try {
      const contract = getContract();
      const history = await contract.getProductHistory(productId);
      
      return {
        id: history.id.toString(),
        name: history.name,
        quantity: history.quantity.toString(),
        harvestDate: new Date(Number(history.harvestDate) * 1000),
        statuses: history.statuses,
        iotData: history.iotData,
        timestamps: history.timestamps.map((ts: any) => new Date(Number(ts) * 1000))
      };
    } catch (error) {
      console.error('Error fetching product history:', error);
      toast.error('Failed to fetch product history');
      throw error;
    }
  };

  const getProductsByOwner = async (ownerAddress: string) => {
    try {
      const contract = getContract();
      const productIds = await contract.getProductsByOwner(ownerAddress);
      return productIds.map((id: any) => id.toString());
    } catch (error) {
      console.error('Error fetching products by owner:', error);
      toast.error('Failed to fetch products');
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