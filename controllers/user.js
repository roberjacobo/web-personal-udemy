const bcrypt = require('bcryptjs');
const User = require('../models/user');
const image = require('../utils/image');
const { deleteLocalFileIfExists } = require('./helpers');

async function getMe (req, res) {
  const { user_id } = req.user;

  const response = await User.findById(user_id);

  if (!response) {
    res.status(400).send({ msg: 'No se ha encontrado usuario.' });
  } else {
    res.status(200).send(response);
  }
}

async function getUsers (req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await User.find();
  } else {
    response = await User.find({ active });
  }

  res.status(200).send(response);
}

function createUser (req, res) {
  const requiredFields = Object.keys(req.body);

  if (!requiredFields.every((field) => req.body[field]?.trim())) {
    return res.status(400).send({ msg: 'Todos los valores son requeridos' });
  }
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const user = new User({ ...req.body, active: false, password: hashPassword });

  if (req.files.avatar) {
    const imagePath = image.getFilePath(req.files.avatar);
    user.avatar = imagePath;
  }

  user.save((error, userStored) => {
    if (error) {
      res.status(400).send({ msg: 'Error al crear el usuario.' });
    } else {
      res.status(201).send(userStored);
    }
  });
}

async function updateUser (req, res) {
  const { id } = req.params;
  const userData = req.body;

  // Password
  if (userData.password) {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(userData.password, salt);
    userData.password = hashPassword;
  } else {
    delete userData.password;
  }

  // Avatar
  if (req.files.avatar) {
    try {
      const doc = await User.findById(id);
      const { avatar } = doc;
      if (avatar !== undefined) {
        await deleteLocalFileIfExists(avatar);
      }
      const imagePath = image.getFilePath(req.files.avatar);
      userData.avatar = imagePath;
    } catch (error) {
      throw new Error(error);
    }
  }

  User.findByIdAndUpdate({ _id: id }, userData, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al actualizar el usuario' });
    } else {
      res.status(200).send({ msg: 'Usuario actualizado' });
    }
  });
}

function deleteUser (req, res) {
  const { id } = req.params;

  User.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al eliminar el usuario' });
    } else {
      res.status(200).send({ msg: 'Usuario eliminado' });
    }
  });
}

module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
