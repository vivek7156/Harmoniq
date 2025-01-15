import { User } from "../models/user.model.js";

export default authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;
        
        const user = await User.findOne({ clerkId: id});
        
        if(!user){
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
};