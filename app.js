const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require('dotenv').config()


const db = require("./db");
const Todo = require("./Todo");
const usertat = require("./Users");

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

// const colors = require('colors/safe')

const secret = process.env.SECRET

const path = require('path')
// console.log(Todo);

app.use(express.json());
app.use(cors());


// CRUD: Create, Read, Update, Delete

app.get("/tasks", (req, res) => {
  Todo.find({}, (err, data) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      res.json(data);
    }
  });
});

//              ?key=value&key=value
app.get("/filter", (req, res) => {
  console.log(req.query);
  Todo.find({ isCompleted: req.query.isCompleted }, (err, data) => {
    if (err) {
      console.log("ERR", err);
    } else {
      // console.log(data);
      res.json(data);
    }
  });
});
/*
the up endpoint is replace to these two get certain isCompleted conditions
app.get("/completed", (req, res) => {
  Todo.find({ isCompleted: true }, (err, data) => {
    if (err) {
      console.log("ERR", err);
    } else {
      // console.log(data);
      res.json(data);
    }
  });
});
app.get("/not_completed", (req, res) => {
  Todo.find({ isCompleted: false }, (err, data) => {
    if (err) {
      console.log("ERR", err);
    } else {
      // console.log(data);
      res.json(data);
    }
  });
});
*/

app.post("/tasks", (req, res) => {
  // console.log('25:',req.body);
  Todo.create(req.body, (err, newTask) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      res.status(201).json(newTask);
    }
  });
});

app.post("/tasks/:id", (req, res) => {

  usertat.findById(req.params.id, (err, theUser) => {
    if (err) {
         console.log("ERROR: ", err);
        } else {
          theUser.Todos.push({
            title:req.body.title,
            isCompleted:req.body.isCompleted
          })
        }
  })
  // console.log('25:',req.body);
  // Todo.create(req.body, (err, newTask) => {
  //   if (err) {
  //     console.log("ERROR: ", err);
  //   } else {
  //     res.status(201).json(newTask);
  //   }
  // });
});


app.delete("/tasks/:id", (req, res) => {
  // console.log("37:", req.params.id);

  Todo.deleteOne({ _id: req.params.id }, (err, deleteObj) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      deleteObj.deletedCount === 1
        ? res.json("Delete one todo successfully")
        : res.status(404).json("This todo is not found");
    }
  });
});

app.delete("/Alltasks", (req, res) => {
  // console.log("37:", req.params.id);

  Todo.deleteMany({}, (err, deleteObj) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      console.log(deleteObj);
      deleteObj.deletedCount === 0
        ? res.status(404).json("There is no completed todo found")
        : res.json("Delete all completed todos successfully");
    }
  });
});

// app.put("/tasks/:id", (req, res) => {
//   // console.log("37:", req.params.id);
//   Todo.updateOne(
//     { _id: req.params.id },
//     { title: req.body.title },
//     (err, updateObj) => {
//       if (err) {
//         // console.log("ERROR: ", err);
//         res.status(400).json(err);
//       } else {
//         console.log(updateObj);
//         updateObj.modifiedCount === 1
//           ? res.json("Update one todo successfully")
//           : res.status(404).json("This todo is not found");
//       }
//     }
//   );
// });

app.get('/path',(req,res) =>{
usertat.find({},(err,data) =>{
  res.json(data)
})
})

app.put("/tasks/:id/:isCompleted", (req, res) => {
  console.log("124:", req.params);
  Todo.updateOne(
    { _id: req.params.id },
    { isCompleted: req.params.isCompleted },
    (err, updateObj) => {
      if (err) {
        // console.log("ERROR: ", err);
        res.status(400).json(err);
      } else {
        console.log(updateObj);
        updateObj.modifiedCount === 1
          ? res.json("Update one todo successfully")
          : res.status(404).json("This todo is not found");
      }
    }
  );
});

app.post("/users/register",  (req, res) => {

usertat.find({email:req.body.email,password:req.body.password})
  .exec()
  .then(users => {
    if(users.length >= 1 ){
      return res.status(409).json({message:'This user information has been used'})
    }
    else{
      bcrypt.hash(req.body.password,10, function (err,hash){
      if(err){
        return res.status(500).json({
          error: err,
          message:'Server error'
        })
      }else{
        const user = new usertat ({
          email:req.body.email,
          password:hash,
          username:req.body.username,
        })
        
        user.save()
        .then(result => res.status(201).json({message:'Registered successfully'}))
        .catch(err => res.status(409).json({message:'Registeration failed'}))
        }
      })
    }
  })

  // Down register without bcrypt

  // usertat.create(req.body, (err, newUser) => {

  //   if (err) {
  //     console.log("ERROR: ", err);
  //     res.status(400).json({ message: "This email is already taken" });
  //   } else {
  //     // res.status(201).json(newUser);
  //     // console.log(newUser)
      
  //     res.status(201).json({ message: "Create New User Successfully" });
  //   }
  });

  




// app.post("/users/login", (req, res) => {
//   usertat.find({ email: req.body.email }, (err, data) => {
//     if (err) {
      
//       console.log("ERROR: ", err);
    
//     } else {
     
//       console.log(data);
//       if (data.length === 1) {
//         console.log("we found the user")
//         // res.status(200).json({ message: "we found the user" });

//         if (req.body.password === data[0].password) {
//           res.status(200).json({
//                           message: "Login Successfully",
//                           username: data[0].username,});
//           console.log("the password is correct");
//         } else {
//           console.log("the password is incorrect");
//           res.status(400).json({message:"the password is incorrect",});
//         }
//         // res.status(201).json({ message: "This user is vlidated", });
//         // res.json(data[0].username);
       
//       } else {
//         console.log("we didn't find the user")
//         res.status(404).json({ message: "we didn't find the user", });
//       }
//     }
//   });
// });

app.post("/users/login", (req, res) => {

  usertat.find({ email: req.body.email })
  .exec()
  .then(users => {
    if(users.length < 1){
      return res.status(404).json({
        message:"Authorization failed"
      }); 
    }
    bcrypt.compare(req.body.password, users[0].password, (err,Equals) =>{
      if (err) return res.sendStatus(401)
      if(Equals){

        const token = jwt.sign({
          email:users[0].email,
          password:users[0].password,
          username:users[0].username
        },
        secret,{
          expiresIn:"1h"
        })
        return res.status(200).json({
          message:'Authorization Successful',
          token:token,
          username:users[0].username
        })
        // create a token
      }
      res.status(404).json({
        message:"Authorization failed"
      }); 
    })
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
    })
  })

// login without bcrypt

  // usertat.find({ email: req.body.email }, (err, arrUserFound) => {
  //   if (err) {
  //     console.log("ERROR: ", err);
  //   } else {
  //     // console.log(arrUserFound);
  //     if (arrUserFound.length === 1) {
  //       // we found the user
  //       if (req.body.password === arrUserFound[0].password) {
  //         // password correct
  //         res.status(200).json({
  //           message: "Login Successfully",
  //           username: arrUserFound[0].username,
  //         });
  //       } else {
  //         // password incorrect
  //         res.status(400).json({
  //           message: "Wrong password",
  //         });
  //       }
  //     } else {
  //       res.status(404).json({
  //         message: "The email entered is not registered",
  //       });
  //     }
  //   }
  // });
});



// app.delete("/users/login/:email", (req, res) => {
//   // console.log("37:", req.params.id);

//   usertat.deleteOne({ email: req.params.email }, (err, deletedObj) => {
//     if (err) {
//       console.log("ERROR: ", err);
//     } else {
//       deletedObj.deletedCount === 1
//         ? res.json("Delete one user successfully")
//         : res.status(404).json("This user is not found");
//     }
//   });
// });







app.use(express.static(path.join(__dirname, "front_end", "build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front_end", "build", "index.html"));
});


const port =  process.env.PORT || 5000;
const host = "0.0.0.0"
app.listen(port,host, () => {
  console.log((`SERVER IS WORKING  ON ${port}`));
});


