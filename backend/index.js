const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {  exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
  });
// Start the server
app.post("/run-pipeline", (req, res) => {
    const { productUrl } = req.body;

    if (!productUrl) {
        return res.status(400).json({ error: "Product URL is required" });
    }

    // Path to the pipeline script
    const pipelinePath = path.join(__dirname, "run_pipeline.py");

    // Run the pipeline script 
    exec(`python "${pipelinePath}" "${productUrl}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Pipeline Error: ${stderr}`);
            return res.status(500).send(stderr);
        }
        try {
            // Parse the JSON output from the pipeline
            const result = JSON.parse(stdout);
            res.json(result); 
        } catch (err) {
            res.status(500).json({ error: "Failed to parse pipeline output" });
        }
    });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));