const formidable = require("formidable");

const fileParser = (req, res, next) => {
  // console.log("req: ", req);
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing the files", err);
      return next(err);
    }

    req.body = req.body || {};
    // console.log("body 1", req.body);
    // console.log("fileds", fields);
    // console.log("files", files);
    for (const key in fields) {
      if (fields[key]) {
        const value = fields[key][0];

        try {
          req.body[key] = JSON.parse(value);
        } catch (e) {
          req.body[key] = value;
        }

        // if (!isNaN(req.body[key])) {
        //   req.body[key] = Number(req.body[key]);
        // }

        if (
          typeof req.body[key] === "string" &&
          !isNaN(req.body[key]) &&
          req.body[key].trim() !== ""
        ) {
          req.body[key] = Number(req.body[key]);
        }
      }
    }
    // console.log("body-----------", req.body);
    req.files = req.files || {};
    // console.log("files: --", req.files);
    // Convert files to req.files
    for (const key in files) {
      const actualFiles = files[key];
      if (!actualFiles) break;

      if (Array.isArray(actualFiles)) {
        req.files[key] = actualFiles.length > 1 ? actualFiles : actualFiles[0];
      } else {
        req.files[key] = actualFiles;
      }
    }
    next();
  });
};

module.exports = fileParser;
