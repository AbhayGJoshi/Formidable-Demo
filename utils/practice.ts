import path from "path";

function getBaseName(fullname: string) {
  const filename = path.parse(fullname).name || "";
  return filename;
}

console.log(getBaseName("originalFile.jpg"));
