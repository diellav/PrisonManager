const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const roleRoutes = require("./backend/routes/roleRoute");
app.use("/api/roles", roleRoutes);

const cellRoutes = require("./backend/routes/cellRoute");
app.use("/api/cells", cellRoutes);



const userRoutes = require("./backend/routes/userRoute");
app.use("/api/users", userRoutes);

const lawyerRoutes = require("./backend/routes/lawyerRoute");
app.use("/api/lawyers", lawyerRoutes);

const emergencyContactRoutes = require('./backend/routes/emergencyContactRoute');
app.use("/api/emergency_contacts", emergencyContactRoutes);

const budgetRoutes = require("./backend/routes/budgetRoute");
app.use("/api/budgets", budgetRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
