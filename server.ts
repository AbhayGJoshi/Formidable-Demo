import express from "express";
import formidRouter from "./routes/formidRouter";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use("/api/formidable", formidRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
