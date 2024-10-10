import express from 'express';
import { deleteEntryById, fetchAllEntries, findEntryById, updateEntryById } from '../controller/file.crud.js';


const router = express.Router();

// Routes for DataEntry operations
router.get('/entries', fetchAllEntries); // Fetch all entries
router.get('/entries/:id', findEntryById); // Find entry by ID
router.put('/entries/:id', updateEntryById); // Update entry by ID
router.delete('/entries/:id', deleteEntryById); // Delete entry by ID

export default router;
