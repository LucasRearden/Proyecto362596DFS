import User from "../models/user.model.js";


//este metodo posiblente sea solo para un user admin, no para todos los usuarios
export const getAllUsersService = async () => {
    return await User.find();
};

export const getUserByIdService = async (id) => {
    return await User.findById(id).select("+password");
};


//obtener usuario por email
export const getUserByEmail = async (data) => {
    return await User.findOne({ email: data });
}

//obtener usuario por username
export const getUserByUsername = async (data) => {
    return await User.findOne({ username: data });
}

//este metodo se lo delegamos auth service, porque sera usado 
//en el registro aunque bien puede estar en user service
// export const createUserService = async (data) => {
//     // const user = new User(data);
//     // return await user.save();
//     return await User.create(data);
// };

export const deleteUserService = async (id) => {
    return await User.findByIdAndDelete(id);
};

export const updateUserService = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
};

export const replaceUserService = async (id, data) => {
    return await User.findByIdAndReplace(id, data, { new: true });
}


