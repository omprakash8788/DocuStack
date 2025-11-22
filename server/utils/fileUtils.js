const fs = require("fs");

exports.cleanupFiles = (files) => {
  files.forEach(f => {
    fs.unlink(f.path, err => {
      if (err) console.error("Failed to delete temp file:", f.path);
    });
  });
};
