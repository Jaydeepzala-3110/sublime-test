import { DataEntry } from "../model/data.model";

// Fetch All Content
export const fetchAllEntries = async (req, res) => {
    try {
        const entries = await DataEntry.find();
        res.status(200).json({
            message: 'Fetched all entries successfully',
            entries,
        });
    } catch (error) {
        console.error('Error fetching all entries:', error);
        res.status(500).json({ message: 'Error fetching all entries', error });
    }
};



// Find Entry by ID
export const findEntryById = async (req, res) => {
    const entryId = req.params.id;

    try {
        const entry = await DataEntry.findOne({ id: entryId });

        if (!entry) {
            return res.status(404).json({ message: `Entry with id ${entryId} not found` });
        }

        res.status(200).json({
            message: `Entry with id ${entryId} fetched successfully`,
            entry,
        });
    } catch (error) {
        console.error(`Error fetching entry with id ${entryId}:`, error);
        res.status(500).json({ message: `Error fetching entry with id ${entryId}`, error });
    }
};


// Update Entry by ID
export const updateEntryById = async (req, res) => {
    const entryId = req.params.id;
    const newContent = req.body.content;

    try {
        const entry = await DataEntry.findOneAndUpdate(
            { id: entryId },
            { content: newContent },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ message: `Entry with id ${entryId} not found` });
        }

        res.status(200).json({
            message: `Entry with id ${entryId} updated successfully`,
            updatedEntry: entry,
        });
    } catch (error) {
        console.error(`Error updating entry with id ${entryId}:`, error);
        res.status(500).json({ message: `Error updating entry with id ${entryId}`, error });
    }
};


// Delete Entry by ID
export const deleteEntryById = async (req, res) => {
    const entryId = req.params.id;

    try {
        const entry = await DataEntry.findOneAndDelete({ id: entryId });

        if (!entry) {
            return res.status(404).json({ message: `Entry with id ${entryId} not found` });
        }

        res.status(200).json({
            message: `Entry with id ${entryId} deleted successfully`,
        });
    } catch (error) {
        console.error(`Error deleting entry with id ${entryId}:`, error);
        res.status(500).json({ message: `Error deleting entry with id ${entryId}`, error });
    }
};
