const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

router.post("/", (req, res) => {
    const { productUrl } = req.body;  // Get URL from request

    if (!productUrl) {
        return res.status(400).json({ error: "Product URL is required" });
    }

    // Call the Python script
    const pythonProcess = spawn("python", ["backend/analyze_reviews.py", productUrl]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "AI review analysis failed" });
        }
        res.json(JSON.parse(output));  // Send JSON response to frontend
    });
});

module.exports = router;
