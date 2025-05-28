const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const { verifyToken } = require('./backend/authMiddleware');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const authRoutes = require('./backend/routes/authRoute');
app.use("/api/auth", authRoutes);

const profileRoute = require('./backend/routes/profileRoute');
app.use("/api/profile", verifyToken, profileRoute);

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

const blockRoutes = require("./backend/routes/blockRoute");
app.use("/api/blocks",verifyToken, blockRoutes);

const assetsRoutes = require("./backend/routes/assetsRoute");
app.use("/api/assets", verifyToken, assetsRoutes);

const judgeRoutes = require("./backend/routes/judgeRoute");
app.use("/api/judges", verifyToken, judgeRoutes);

const operationalExpenses = require("./backend/routes/operational_expenseRoute");
app.use("/api/operational_expenses", verifyToken, operationalExpenses);

const staffSalary = require("./backend/routes/staffSalaryRoute");
app.use("/api/staff_salaries", verifyToken, staffSalary);

const prisonersRoutes = require("./backend/routes/prisonersRoute");
app.use("/api/prisoners", verifyToken, prisonersRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
