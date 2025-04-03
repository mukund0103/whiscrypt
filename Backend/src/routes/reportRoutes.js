const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

// 📌 POST: Submit a report
router.post("/", async (req, res) => {
  try {
    const { title, content, submittedBy, category, metadata, attachments } = req.body;

    // Create new report instance
    const newReport = new Report({
      title,
      content,
      submittedBy,
      category,
      metadata,
      attachments,
    });

    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting report" });
  }
});

// 📌 GET: Fetch all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
});

// 📌 GET: Fetch a report by ID
router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    res.json({ ...report._doc, content: report.getDecryptedContent() });
  } catch (error) {
    res.status(500).json({ error: "Error fetching report" });
  }
});

module.exports = router;
