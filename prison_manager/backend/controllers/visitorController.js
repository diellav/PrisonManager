const bcrypt = require('bcrypt');
const visitorModel = require("../models/visitorModel");


const getVisitors = async (req, res) => {
  try {
    const visitors = await visitorModel.getAllVisitors();
    res.json(visitors);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const getVisitor = async (req, res) => {
  try {
    const visitor = await visitorModel.getVisitorById(req.params.id);
    if (!visitor) return res.status(404).send("Visitor not found");
    res.json(visitor);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const addVisitor = async (req, res) => {
  try {
    const newVisitor = req.body;


    if (newVisitor.password) {
      newVisitor.password = await bcrypt.hash(newVisitor.password, 10);
    }

    await visitorModel.createVisitor(newVisitor);
    res.status(201).send("Visitor created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const updateVisitor = async (req, res) => {
  try {
    const updatedVisitor = req.body;

    if (updatedVisitor.password) {
      updatedVisitor.password = await bcrypt.hash(updatedVisitor.password, 10);
    }

    await visitorModel.updateVisitor(req.params.id, updatedVisitor);
    res.send("Visitor updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const deleteVisitor = async (req, res) => {
  try {
    await visitorModel.deleteVisitor(req.params.id);
    res.send("Visitor deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const getVisitorProfile = async (req, res) => {
  try {
    const visitorId = req.user.visitorID;
    const visitor = await visitorModel.getVisitorById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const signUpVisitor = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      password, 
      email,
    } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const visitorData = {
      first_name,
      last_name,
      username,
      password: hashedPassword,
      email,
    };

    await visitorModel.createVisitor(visitorData);
    res.status(201).json({ message: "Visitor registered successfully" });

  } catch (error) {
    console.error("Error in visitor signUp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const loginVisitor = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const visitor = await visitorModel.getVisitorByUsername(username);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, visitor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password" });
    }


    res.json({ message: "Login successful", visitor });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getVisitors,
  getVisitor,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitorProfile,
  signUpVisitor,
  loginVisitor,
};
