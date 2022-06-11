const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
        user(username:String!): User
        books: [Book]
        book(_id: ID!): Book
    }

    type Mutation {
        login(email: String!, password: String!): User
        createUser(username: String!, email: String!, password: String!): User
        saveBook(authors:[String]!, description: String!, title: String!, bookId: String!, image: String, link: String): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;