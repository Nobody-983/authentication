import { pool } from "../config/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, ) => {
    const { username,email, password } = req.body;
if (!email || !password || !username) {
    return res.status(400).json(
        { message: "All fields are required" }
    );
  }
  if (!email.includes("@")) {
     return res.status(400).json(
        { message: "Invalid email" }
    );
  }
  if (username.trim() === "") {
     return res.status(400).json(
        { message: "Pls input username" }
    );
  }
  if (password.length < 8) {
    return res.status(400).json(
        { message: "Password field is too short" }
    );
  }
  const mail = await pool.query(`
    select email from users 
    where email = $1
    `,
    [email]
)
    if (mail.rows.length) {
      
    return res.status(400).json({ message: "user already esists" });
  
    }

    const passwordHash = await bcrypt.hash(password, 10);

const result = await pool.query(`
    INSERT INTO users (username, email, password_hash)
VALUES ($1, $2, $3)
`,
[username,email,passwordHash])
    res.status(201).json({ message: "User created successfully" });

} 

const loginUser = async (req,res) => {
    const{email,password} = req.body
    if (!email || !password ) {
    return res.status(400).json({ message: "All fields are required" });
  }
   const mail = await pool.query(`
    select email, password_hash, id, username from users 
    where email = $1 
    `,
    [email]
)
    if (!mail.rows.length) {
      
    return res.status(400).json({ message: "invalid email or password" });
  
    }
    const user = mail.rows[0];

    const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
);

if (!passwordMatch) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}
const token = jwt.sign(
    {
        id: user.id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

    res.status(200).json({ user:user.id,
        token
     });
}



export {registerUser,loginUser}