import jwt from "jsonwebtoken"

export const authMiddleware = (req,res,next) =>{
  const head =  req.headers.authorization
  if (!head) {
    return res.status(401).json({
      message: "No authentication token"
    })
  }
  const bear = head.split(" ")[1]
  let token
  try {
   token =  jwt.verify(
      bear,  process.env.JWT_SECRET

    )
  } catch (error) {
   return res.status(401).json({
      message: error.message
    })
  }
req.user = token
  next()
}