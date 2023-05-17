const Newsletter = require('../models/newsletter');

function subscribeEmail (req, res) {
  const { email } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).send({ msg: 'Email obligatorio' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send({ msg: 'Formato de email inválido' });
  }

  const newsletter = new Newsletter({
    email: email.toLowerCase()
  });

  newsletter.save((error) => {
    if (error) {
      return res.status(400).send({ msg: 'El email ya está registrado' });
    }
    res.status(200).send({ msg: 'Email registrado exitosamente' });
  });
}

function getEmails (req, res) {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  };

  Newsletter.paginate({}, options, (error, emailsStored) => {
    if (error) {
      res.status(400).send({ msg: 'Error al obtener los emails' });
    } else {
      res.status(200).send(emailsStored);
    }
  });
}

function deleteEmail (req, res) {
  const { id } = req.params;

  Newsletter.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al eliminar el registro' });
    } else {
      res.status(200).send({ msg: 'Eliminacion correcta' });
    }
  });
}

module.exports = {
  subscribeEmail,
  getEmails,
  deleteEmail
};
