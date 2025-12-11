import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/userModel.js';

dotenv.config();

const accounts = [
{
    firstName: 'Admin',
    lastName: 'TruckFlow',
    email: 'admin@truckflow.com',
    password: 'password123',
    role: 'admin'
},
{
    firstName: 'Driver',
    lastName: 'TruckFlow',
    email: 'driver@truckflow.com',
    password: 'driver123456',
    role: 'driver'
}
];

const initAccounts = async () => {
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');

    for (const account of accounts) {
    const exists = await User.findOne({ email: account.email });
    
    if (exists) {
        console.log(`⚠️  ${account.email} existe déjà`);
        continue;
    }

    await User.create(account);
    console.log(`✅ Compte créé: ${account.email} (${account.role})`);
    }

    console.log('\n🎉 Initialisation terminée');
    process.exit(0);
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
};

initAccounts();
