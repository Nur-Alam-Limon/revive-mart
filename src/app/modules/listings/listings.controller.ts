import { Request, Response } from 'express';
import { createListing, getAllListings, getListingById, updateListingById, deleteListingById } from './listings.service';

export const addListing = async (req: Request, res: Response) => {
  try {
    const listing = await createListing({ ...req.body, userId: req.user?.id });
    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Failed to add listing' });
  }
};

export const getListings = async (_req: Request, res: Response) => {
  try {
    const listings = await getAllListings();
    res.status(200).json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve listings' });
  }
};

interface Params {
  id: string;
}

export const getListing = async (req: Request<Params>, res: Response): Promise<void> => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ success: false, message: 'Listing not found' });
      return;
    }

    res.status(200).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve listing' });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    const listing = await updateListingById(req.params.id, req.body);
    res.status(200).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update listing' });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    await deleteListingById(req.params.id);
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete listing' });
  }
};
