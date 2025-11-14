// import mongoose from "mongoose";

// const userSchema =  new mongoose.Schema({
//     name:{type:String, required:true},
//     email: {type:String,required:true, unique:true},
//     password: {type:String, required:true},
//     role:{type:String,enum:["admin","member"], default:"member"},
//     profileImage:{type:String},
//     createAt: {type:Date,default:Date.now},
//     updateAt: {type:Date,default:Date.now}
// })

// const User = mongoose.model("User",userSchema)
// export default User;



// backend/models/User.js



import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    avatar: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
