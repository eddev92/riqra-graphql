const { ApolloServer, gql } = require('apollo-server');
const { path } = require('path');

// This is a (sample) collection of comments we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const comments = [];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  input CommentInput {
    comment: String
  }
  # This "Comment" type can be used in other type declarations.
  type Comment {
    comment: String
    position: Int
  }
  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
   comments: [Comment]
   addSimpleComment(comment: String): Comment
   deleteSimpleComment(comment: String, position: Int): [Comment]
   getListComments: [Comment]
  }
`;

function addComment(args, comment) {
  comments.push(comment);
  return comments;
}

function deleteComment(args, comment) {
  for (let i = 0; i < comments.length; i++) {
    if ((comments[i].comment === comment.comment) && i === comment.position) {
      comments.splice(i, 1);
      return comments;
    } 
  }
}

function getComments() {
  return comments;
}

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve comments from the  comments" array above.
const resolvers = {
  Query: {
   comments: () => comments,
   addSimpleComment: async (args,comment) => addComment(args, comment),
   deleteSimpleComment: async (args, comment) => deleteComment(args, comment),
   getListComments: async () => getComments
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
 return console.log(`🚀  Server ready at :D ${url}`);
});
