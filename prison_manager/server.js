const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const { verifyToken } = require('./backend/authMiddleware');

app.use(cors());
app.use(express.json());

const authRoutes = require('./backend/routes/authRoute');
app.use("/api/auth", authRoutes);

const roleRoutes = require("./backend/routes/roleRoute");
app.use("/api/roles", verifyToken, roleRoutes);

const cellRoutes = require("./backend/routes/cellRoute");
app.use("/api/cells", verifyToken, cellRoutes);

const userRoutes = require("./backend/routes/userRoute");
app.use("/api/users", verifyToken, userRoutes);

const lawyerRoutes = require("./backend/routes/lawyerRoute");
app.use("/api/lawyers", verifyToken, lawyerRoutes);

const emergencyContactRoutes = require('./backend/routes/emergencyContactRoute');
app.use("/api/emergency_contacts", verifyToken, emergencyContactRoutes);

const budgetRoutes = require("./backend/routes/budgetRoute");
app.use("/api/budgets", verifyToken, budgetRoutes);

// Start serverin
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
