import { asyncHandler } from "../utilities/async-handler.js"

const healthCheck = asyncHandler(async (req,res)=>{
  res.status(200).json({"message": "All things are good"})
})


export {
  healthCheck
}
