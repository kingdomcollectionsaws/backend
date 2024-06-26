const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const jwtProvider = require("../config/jwtProvider");
const { findOne } = require('../models/address.model.js');

const createUser = async (userData) => {
    try {

        let { firstName, lastName, email, password, role, mobile } = userData;

        const isUserExist = await User.findOne({ email });


        if (isUserExist) {
            throw new Error("user already exist with email : ", email)
        }

        password = await bcrypt.hash(password, 8);
        let joiningBonus;
        if (role == 'GUEST') {
            joiningBonus = 0
        } else {
            joiningBonus = 50
        }

        const user = await User.create({ firstName, lastName, email, password, role, joiningBonus })



        return user;

    } catch (error) {

        throw new Error("k", error.message)
    }

}
const updateUser = async (data, userId) => {
    try {
        let { firstName, lastName, email, password, mobile, joiningBonus } = data;
        let user = await User.findById(userId);
        if (!user) {
            return { msg: "no user found", success: true }
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        if (password) {
            password = await bcrypt.hash(password, 8);
            user.password = password || user.password;
        }
        user.mobile = mobile || user.mobile;
        user.role = 'CUSTOMER' || user.role;
        user.joiningBonus = joiningBonus || user.joiningBonus
        user
        user.save()
        return { msg: "user updated successfully", success: true }
    } catch (error) {
        throw new Error(error.message)
    }

}
const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("user not found with id : ", userId)
        }
        return user;
    } catch (error) {

        throw new Error(error.message)
    }
}

const getUserByEmail = async (email) => {
    try {

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("user found with email : ", email)
        }

        return user;

    } catch (error) {

        throw new Error(error.message)
    }
}

const getUserProfileByToken = async (token) => {
    try {

        const userId = jwtProvider.getUserIdFromToken(token)




        const user = (await findUserById(userId)).populate("addresses");
        user.password = null;

        if (!user) {
            throw new Error("user not exist with id : ", userId)
        }
        return user;
    } catch (error) {

        throw new Error(error.message)
    }
}

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {

        throw new Error(error.message)
    }
}

module.exports = {
    createUser,
    findUserById,
    getUserProfileByToken,
    getUserByEmail,
    getAllUsers,
    updateUser
}