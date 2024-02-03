import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL).then((data) => {
            console.log(`Database connected with ${data.connection.host}`)
        })
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;