const Course = require("../models/course");
const image = require("../utils/image");
const fs = require("fs");

function createCourse(req, res) {
  const course = new Course(req.body);

  const imagePath = image.getFilePath(req.files.miniature);
  course.miniature = imagePath;

  course.save((error, courseStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el curso" });
    } else {
      res.status(201).send(courseStored);
    }
  });
}

async function getCourses(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page,
    limit: parseInt(limit),
  };

  await Course.paginate({}, options, (error, courses) => {
    if (error) {
      res.status(400).send({ msg: "Error al obtener los cursos" });
    } else {
      res.status(200).send(courses);
    }
  });
}

/**
 *
 * @param {string} miniaturePath File path if exists.
 */
const replaceLocalMiniatureIfExists = (miniaturePath) => {
  fs.unlink(`./uploads/${miniaturePath}`, (error) => {
    if (error) {
      console.error(error);
    }
    console.log("El archivo se ha reemplazado correctamente");
  });
};

function updateCourse(req, res) {
  const { id } = req.params;
  const courseData = req.body;

  if (req.files.miniature) {
    Course.findById(id, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        const { miniature } = doc;
        if (miniature !== undefined) {
          replaceLocalMiniatureIfExists(miniature);
        }
      }
    });

    const imagePath = image.getFilePath(req.files.miniature);
    courseData.miniature = imagePath;
  }

  Course.findByIdAndUpdate({ _id: id }, courseData, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el curso" });
    } else {
      res.status(200).send({ msg: "Curso actualizado" });
    }
  });
}

function deleteCourse(req, res) {
  const { id } = req.params;

  Course.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el curso" });
    } else {
      res.status(200).send({ msg: "Curso eliminado" });
    }
  });
}

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };
