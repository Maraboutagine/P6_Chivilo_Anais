const Sauce = require("../models/sauce");
const fs = require("fs");
const sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
  console.log("test");
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: "objet" }))
    .catch((error) => console.log(error));
};

exports.modifySauce = (req, res, next) => {
  console.log(req.body.sauce);
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (res.locals.idUser == sauce.userId) {
      const sauceObjet = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObjet, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "bien modifié" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      res.status(400).json({ message: "non autorisé" });
    }
  });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (res.locals.idUser == sauce.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res.status(400).json({ message: "non autorisé" });
      }
    })

    .catch((error) => res.status(500).json({ error }));
};

exports.getOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAll = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id,
              }
            )
              .then(() => {
                res
                  .status(201)
                  .json({ message: "Ton avis a été pris en compte!" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              }
            )
              .then(() => {
                res.status(201).json({ message: "ok" });
              })
              .catch((error) => {
                res.status(400).json({ error: error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error: error });
        });
      break;

    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => {
          res.status(201).json({ message: "Like ajouté" });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;

    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
        .then(() => {
          res.status(201).json({ message: "Like enlevé" });
        })
        .catch((error) => {
          res.status(400).json({ error: error });
        });
      break;
    default:
      console.error("Bad request");
  }
};
