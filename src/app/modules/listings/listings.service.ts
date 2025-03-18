import { ListingModel } from './listings.model';
import { IListing } from './listings.interface';

export const createListing = async (listingData: IListing) => {
  const listing = new ListingModel(listingData);
  return await listing.save();
};

export const getAllListings = async () => {
  return await ListingModel.find({ status: 'available' });
};

export const getListingById = async (id: string) => {
  return await ListingModel.findById(id);
};

export const updateListingById = async (id: string, updateData: Partial<IListing>) => {
  return await ListingModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteListingById = async (id: string) => {
  return await ListingModel.findByIdAndDelete(id);
};
