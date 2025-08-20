import fs from "fs";

fs.readFile("./sample.md", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  data.split("\n").forEach((line, index) => {
    if (line.trim() === "") {
      console.log(`Line ${index + 1} is empty`);
    } else {
      console.log(`Line ${index + 1}: ${line}`);
    }
  });  
});
