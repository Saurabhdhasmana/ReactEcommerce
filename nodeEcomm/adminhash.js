const bcrypt=require('bcryptjs');
const hasing=async()=>{
const password=await bcrypt.hash("admin@123",10);
console.log("Hashed Password:", password)
}
hasing();
//$2b$10$71EtsGz7Y3/P/8exm3AM8OrVvQEDQoPzHqbqIvl7x5R0Ai7cj4Ane
//admin@admin.com
//admin@123
//JWT_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGQ0YWVhM2E3MzE2M2VjNDU0MzEzMSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc0OTkwMDUwNCwiZXhwIjoxNzQ5OTg2OTA0fQ.BS8rJ8JeI0DurIHtLCuhbgb2jfC0hlZNF_jalOO3t5k