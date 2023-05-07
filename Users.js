const  {Schema,model} = require("mongoose")

// const todoSchema = new Schema({
//   title: String,
//   isCompleted: Boolean
// })

// Model




const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: String,
     Todos:[{type: Schema.Types.ObjectId, ref: 'Todo' }]
  });

  

const usertat = model("UsersSchema",userSchema)

module.exports = usertat;