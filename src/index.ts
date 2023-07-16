import express from "express";
import * as fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const ROOT_FOLDER = "src/appRoutes";

app.all("/*", (req, res) => {
  let fileUrl = `${ROOT_FOLDER}${req.url}.ts`;

  const isFile = fs.existsSync(fileUrl);

  if (isFile) {
    fileUrl = `${fileUrl}.ts`;
  } else {
    fileUrl = `${fileUrl}/index.ts`;
  }

  const result = handleRegularRoutes(fileUrl, req, res);
  if (result) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "File Not Found" });
  }
});

const handleRegularRoutes = async (fileUrl: string, req: any, res: any) => {
  try {
    const module = await import(fileUrl);
    const data = module.handler(req, res);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.statusCode = 404;
    return false;
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
