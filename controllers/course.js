const Course = require('../models/course');
const image = require('../utils/image');
const { deleteLocalFileIfExists } = require('./helpers');

function createCourse (req, res) {
  const requiredFields = Object.keys(req.body);

  if (!requiredFields.every(field => req.body[field]?.trim())) {
    return res.status(400).send({ msg: 'Todos los valores son requeridos' });
  }

  const course = new Course(req.body);

  const imagePath = image.getFilePath(req.files.miniature);
  course.miniature = imagePath;

  course.save((error, courseStored) => {
    if (error) {
      res.status(400).send({ msg: 'Error al crear el curso' });
    } else {
      res.status(201).send(courseStored);
    }
  });
}

async function getCourses (req, res) {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page,
    limit: parseInt(limit, 10)
  };

  await Course.paginate({}, options, (error, courses) => {
    if (error) {
      res.status(400).send({ msg: 'Error al obtener los cursos' });
    } else {
      res.status(200).send(courses);
    }
  });
}

async function updateCourse (req, res) {
  const { id } = req.params;
  const courseData = req.body;

  if (req.files.miniature) {
    try {
      const doc = await Course.findById(id);
      const { miniature } = doc;
      if (miniature !== undefined) {
        await deleteLocalFileIfExists(miniature);
      }
      const imagePath = image.getFilePath(req.files.miniature);
      courseData.miniature = imagePath;
    } catch (error) {
      throw new Error(error);
    }
  }

  Course.findByIdAndUpdate({ _id: id }, courseData, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al actualizar el curso' });
    } else {
      res.status(200).send({ msg: 'Curso actualizado' });
    }
  });
}

function deleteCourse (req, res) {
  const { id } = req.params;

  Course.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: 'Error al eliminar el curso' });
    } else {
      res.status(200).send({ msg: 'Curso eliminado' });
    }
  });
}

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse
};
