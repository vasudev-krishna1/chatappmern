import mongoose from "mongoose";
const username = encodeURIComponent("sachinyadavpy23");
const password = encodeURIComponent("Sac#2332");
const connectToMongoDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://sachinyadavpy23:k917WR99C7U2lGVM@mernchatdb.urekf.mongodb.net/?retryWrites=true&w=majority&appName=mernchatdb");
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
