const visitsModel = require('../models/visitsModel');

const getApprovedVisits = async (req, res) => {
  try {
    const visits = await visitsModel.getApprovedVisits();
    res.json(visits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gabim në server' });
  }
};

module.exports = {
  getApprovedVisits,
};
