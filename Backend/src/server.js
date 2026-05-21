import app from "./app.js";
import ENV from "./utilities/env.js";

const PORT = ENV.PORT || 8000
app.listen(PORT, ()=>{
  console.log(`server is up and running in http://localhost:${PORT} url`);
})
