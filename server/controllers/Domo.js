const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.coolPoints) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    coolPoints: req.body.coolPoints,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age , coolPoints: newDomo.coolPoints});
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const deleteDomos = async(req, res) => {

  const { name } = req.body;
  // Use name to delete a domo
  if (!req.body.name) {
    return res.status(400).json({error: "Name is required to delete a domo"});
  }
  try {
    const doc = await Domo.deleteOne({
        name,
        owner: req.session.account._id
    });

    return res.status(200).json({ message: 'Domo deleted.', result: doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while deleting the Domo.' });
  }
}

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age coolPoints').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomos
};
