import User from "../models/User.js";


//  READ


export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: error })

    }
}


export const getUserFriends = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        );
        if(friends){

            const formattedfriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            })
            res.status(200).json(formattedfriends);
        }
        else{
            res.status(200).send("no friends are there to visible")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
};


export const addRemoveFriends = async (req, res) => {
     
    try {
        
         const{id,friendId}=req.params;
         const user=await User.findById(id);
         const friend=await User.findById(friendId);

         if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=>id !== friendId);
            friend.friends=friend.friends.filter((id)=>id !== id)
         } else{
            user.friends.push(friendId);
            friend.friends.push(id);
         }

         await user.save();
         await friend.save();
        
    const friends = await Promise.all(
        user.friends.map(async(id) => await User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
  
      res.status(200).json(formattedFriends);

    } catch (error) {

        res.status(404).json({ message: err.message +"errror at server addremove friend" });

    }
}