const sauceObjet = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "objet" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObjet = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  sauce
    .updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
    .then(() => res.status(200).json({ message: "bien modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        sauce
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOne = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAll = (req, res, next) => {
  sauce
    .find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};
