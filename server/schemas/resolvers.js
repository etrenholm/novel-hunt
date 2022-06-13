const { User } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks')

                return userData;
            }
            throw new AuthenticationError('Please log in to see this page.')
        },
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('savedBooks')
        },
        user: async (parent, {username}) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks')
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if(!user) {
                throw new AuthenticationError('Incorrect credentials.')
            }
            const correctPassword = await user.isCorrectPassword(password)

            if(!correctPassword) {
                throw new AuthenticationError('Incorrect credentials.')
            }

            const token = signToken(user)

            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args } },
                    { new: true, runValidators: true }
                ).populate('savedBooks')

                return updatedUser
            }
            throw new AuthenticationError('You need to be logged in.')
        }, 
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks')

                return updatedUser
            }
            throw new AuthenticationError('You need to be logged in.')
        }
    }
}

module.exports = resolvers;