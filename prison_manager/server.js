const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;

const { verifyToken } = require('./backend/authMiddleware');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "./backend/uploads")));

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

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
app.use("/api/blocks", verifyToken, blockRoutes);

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

const scheduleRoute = require("./backend/routes/scheduleRoute");
app.use("/api/staff_schedule", verifyToken, scheduleRoute);

const paroleRoutes = require("./backend/routes/paroleRoute");
app.use("/api/paroles", verifyToken, paroleRoutes);

const casesRoutes = require("./backend/routes/casesRoute"); 
app.use("/api/cases", verifyToken, casesRoutes); 

const courtHearingRoute = require("./backend/routes/court_hearingRoute");
app.use("/api/court_hearings", verifyToken, courtHearingRoute);

const transportStaffRoute = require("./backend/routes/transport_staffRoute");
app.use("/api/transport_staff", verifyToken, transportStaffRoute);

const prisonerMovementsRoutes = require("./backend/routes/prisonerMovementsRoute");
app.use("/api/prisoner_movements", verifyToken, prisonerMovementsRoutes);

const prisonerWorkRoute = require("./backend/routes/prisonerWorkRoute");
app.use("/api/prisoner_work", verifyToken, prisonerWorkRoute);

const kitchenStaffRoute = require("./backend/routes/kitchenStaffRoute");
app.use("/api/kitchen_staff", verifyToken, kitchenStaffRoute);

const prisonerCallRoute = require("./backend/routes/prisoner_callRoute");
app.use("/api/prisoner_calls", verifyToken, prisonerCallRoute);

const maintenanceStaffRoute = require("./backend/routes/maintenance_staffRoute");
app.use("/api/maintenance_staff", verifyToken, maintenanceStaffRoute);

const prisonerAccountRoute = require("./backend/routes/prisonerAccountsRoute");
app.use("/api/prisoner_accounts", verifyToken, prisonerAccountRoute);

const prisonPurchasesRoute = require("./backend/routes/prisonPurchasesRoute");
app.use("/api/prison_purchases", verifyToken, prisonPurchasesRoute);

const transactions = require("./backend/routes/transactionsRoute");
app.use("/api/transactions", verifyToken, transactionsRoute);

const incidentsRoutes = require("./backend/routes/incidentsRoute");
app.use("/api/incidents", verifyToken, incidentsRoutes);

const storeItemsRoute = require("./backend/routes/storeItemsRoute");
app.use("/api/store_items", verifyToken, storeItemsRoute);

const vehiclesRoute = require("./backend/routes/vehiclesRoute");
app.use("/api/vehicles", verifyToken, vehiclesRoute);

const transportRoute = require("./backend/routes/transportRoute");
app.use("/api/transport", verifyToken, transportRoute);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
