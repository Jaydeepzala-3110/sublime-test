import { DataEntry } from '../model/data.model.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import { User } from '../model/user.model.js';

// Hardcoded user ID
const hardcodedUserId = '670779956594d9b89eca2c37';

export const uploadSingleCSV = async (req, res) => {
    try {
        //  const userId = hardcodedUserId;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const fileName = req.file.originalname;
        const filePath = req.file.path;


        const entries = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const dataEntry = {
                    id: parseInt(row.id),
                    content: row.content,
                    uploadedBy: userId,
                };
                entries.push(dataEntry);
            })
            .on('end', async () => {
                console.log('Parsed entries:', entries);

                if (entries.length === 0) {
                    return res.status(400).json({ message: 'No valid entries found in the CSV file.' });
                }

                const promises = entries.map(async (entry) => {
                    try {
                    
                        const existingEntry = await DataEntry.findOne({ id: entry.id });

                        if (existingEntry) {
                            console.log(`Entry with ID ${entry.id} already exists. Skipping...`);
                            return null; 
                        }

                        return await DataEntry.create(entry);
                    } catch (err) {
                        console.error('Error inserting entry:', err);
                        return null; 
                    }
                });

            
                const results = await Promise.all(promises);

        
                const insertedEntries = results.filter(Boolean);


                const updateResult = await User.findByIdAndUpdate(userId, {
                    csvUploaderSingle: {
                        fileName: fileName,
                        filePath: filePath,
                        uploadDate: new Date(),
                    },
                }, { new: true });

                if (!updateResult) {
                    console.log('User update failed. User may not exist.');
                    return res.status(404).json({ message: 'User not found.' });
                }

                console.log('Updated User:', updateResult);

                res.status(200).json({
                    message: 'CSV file uploaded and data stored successfully.',
                    uploadedEntries: insertedEntries,
                });
            })
            .on('error', (error) => {
                console.error('Error reading the CSV file:', error);
                res.status(500).json({ message: 'Error reading the CSV file.', error });
            });
    } catch (error) {
        console.error('Error uploading CSV file:', error);
        res.status(500).json({ message: 'Error uploading CSV file.', error });
    }
};

export const uploadMultipleCSV = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        const userId = hardcodedUserId; // Use the hardcoded user ID
        for (const file of req.files) {
            const results = [];
            const filePath = file.path;

            // Parse CSV file
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', async () => {
                    
                    const entries = results.map((entry) => ({
                        id: parseInt(entry.id),
                        content: entry.name, 
                        uploadedBy: userId,
                    }));

                    await DataEntry.insertMany(entries);

                    fs.unlinkSync(filePath); 
                })
                .on('error', (error) => {
                    console.error('Error reading the CSV file:', error);
                    res.status(500).json({ message: 'Error reading the CSV file.', error });
                });
        }

        res.status(200).json({ message: 'CSV files uploaded and processed successfully.' });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ message: 'Error processing files.', error: error.message });
    }
};
