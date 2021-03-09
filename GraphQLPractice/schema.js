const todoModel = require('./models').todoModel;
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Todo Type
const TodoType = new GraphQLObjectType({
    name:'Customer',
    fields:() =>({
        id: {type:GraphQLInt},
        thing: {type:GraphQLString},
        
    })
})




// Root  Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        todo:{
            type:TodoType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve(parentValue, args){
                return todoModel.findOne({
                    where:{
                        id: args.id
                    }
                }).then(fetchedData=>fetchedData)
            }         
        },
        todos:{
            type: new GraphQLList(TodoType),
            resolve(parentValue, args){
                return todoModel.findAll().then(fetchedData=> fetchedData)
            }
        }

    }
})

// Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addTodo:{
            type:TodoType,
            args:{
                thing:{type:new GraphQLNonNull(GraphQLString)},
                
            },
            resolve(parentValue, args){
                return todoModel.create({
                    thing:args.thing,
                    
                }).then(fetchedData=>fetchedData)
                
            }
        },
        deleteTodo:{
            type:TodoType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return todoModel.destroy({
                    where: {
                        id: args.id
                    }
                    
                }).then(fetchedData=>fetchedData)
            }
        },
        editTodo:{
            type:TodoType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLInt)},
                thing:{type:GraphQLString}
                
            },
            resolve(parentValue, args){
                return todoModel.update(
                    {
                        thing:args.thing
                    },
                    {where:{id: args.id}}  
                ).then(fetchedData=>fetchedData)
            }
        }

    }
})  

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
});