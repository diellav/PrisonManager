// controllers/judgeController.js
const judgeModel = require("../models/judgeModel");

const getJudges = async (req, res) => {
  try {
    const judges = await judgeModel.getAllJudges();
    res.json(judges);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getJudge = async (req, res) => {
  try {
    const judgeID = req.params.id;
    const judge = await judgeModel.getJudgeById(judgeID);
    if (!judge) return res.status(404).send("Judge not found");
    res.json(judge);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addJudge = async (req, res) => {
  try {
    const result = await judgeModel.createJudge(req.body);
    res.status(201).json({ message: "Judge created", judge_ID: result.judge_ID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateJudge = async (req, res) => {
  try {
    await judgeModel.updateJudge(req.params.id, req.body);
    res.send("Judge updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteJudge = async (req, res) => {
  try {
    await judgeModel.deleteJudge(req.params.id);
    res.send("Judge deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getJudges,
  getJudge,
  addJudge,
  updateJudge,
  deleteJudge,
};
