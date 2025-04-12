const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const roleRoutes = require("./backend/routes/roleRoute");
app.use("/api/roles", roleRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
