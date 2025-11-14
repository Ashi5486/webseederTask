import User from "./models/User";
import bcrypt from "bcrypt"

const userRegister = async () => {
    try {
        const hashpassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashpassword,
            role: "admin"
        })
        await newUser.save()

    }
    catch (error) {
        console.log(error)
    }
}
userRegister();
