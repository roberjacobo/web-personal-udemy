const Post = require('../models/post');
const image = require('../utils/image');
const { deleteLocalFileIfExists } = require('./helpers');

function createPost (req, res) {
  const requiredFields = Object.keys(req.body);

  if (!requiredFields.every(field => req.body[field]?.trim())) {
    return res.status(400).send({ msg: 'Todos los valores son requeridos' });
  }

  const post = new Post(req.body);
  post.created_at = new Date();

  const imagePath = image.getFilePath(req.files.miniature);
  post.miniature = imagePath;

  post.save((error, postStored) => {
    if (error) {
      res.status(400).send({ msg: 'Error al crear el post ' });
    } else {
      res.status(201).send(postStored);
    }
  });
}

function getPosts (req, res) {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { created_at: 'desc' }
  };

  Post.paginate({}, options, (error, postStored) => {
    if (error) {
      res.status(400).send({ msg: 'Error al obtener los posts' });
    } else {
      res.status(200).send(postStored);
    }
  });
}

async function updatePost (req, res) {
  const { id } = req.params;
  const postData = req.body;

  if (req.files.miniature) {
    try {
      const doc = await Post.findById(id);
      const { miniature } = doc;
      if (miniature !== undefined && miniature !== null) {
        await deleteLocalFileIfExists(miniature);
      }
      const imagePath = image.getFilePath(req.files.miniature);
      postData.miniature = imagePath;
    } catch (error) {
      throw new Error(error);
    }
  }

  Post.findByIdAndUpdate({ _id: id }, postData, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al actualizar el post' });
    } else {
      res.status(200).send({ msg: 'Actualización correcta' });
    }
  });
}

function deletePost (req, res) {
  const { id } = req.params;

  Post.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al eliminar el post' });
    } else {
      res.status(200).send({ msg: 'Post Eliminado' });
    }
  });
}

function getPost (req, res) {
  const { path } = req.params;

  Post.findOne({ path }, (error, postStored) => {
    if (error) {
      res.status(500).send({ msg: 'Error del servidor' });
    } else if (!postStored) {
      res.status(400).send({ msg: 'No se ha encontrado ningún post' });
    } else {
      res.status(500).send(postStored);
    }
  });
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost
};
