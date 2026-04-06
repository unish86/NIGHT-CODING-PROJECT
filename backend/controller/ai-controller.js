import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend/.env");
  }

  return new GoogleGenAI({ apiKey });
};

const normalizeJsonText = (text) => {
  let normalized = "";
  let inString = false;
  let isEscaped = false;

  for (const char of text) {
    if (inString) {
      if (isEscaped) {
        normalized += char;
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        normalized += char;
        isEscaped = true;
        continue;
      }

      if (char === '"') {
        normalized += char;
        inString = false;
        continue;
      }

      if (char === "\n") {
        normalized += "\\n";
        continue;
      }

      if (char === "\r") {
        normalized += "\\r";
        continue;
      }

      if (char === "\t") {
        normalized += "\\t";
        continue;
      }

      normalized += char;
      continue;
    }

    if (char === '"') {
      inString = true;
    }

    normalized += char;
  }

  return normalized
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1");
};

const parseJsonSafely = (text) => JSON.parse(normalizeJsonText(text));

const extractJson = (rawText, type) => {
  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .replace(/^json\s*/i, "")
    .trim();

  try {
    return parseJsonSafely(cleanedText);
  } catch {
    const matcher = type === "array" ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
    const match = cleanedText.match(matcher);

    if (!match) {
      throw new Error("Failed to parse AI response as JSON");
    }

    return parseJsonSafely(match[0]);
  }
};

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const ai = getAiClient();
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    //? 1. fetch session → get role, experience, topicsToFocus
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const prompt = questionAnswerPrompt(
      session.role,
      session.experience,
      session.topicsToFocus,
      10,
    );
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const rawText = parts
      .filter((p) => !p.thought) // gemini-2.5-flash includes thinking parts; skip them
      .map((p) => p.text ?? "")
      .join("");

    const questions = extractJson(rawText, "array");

    if (!Array.isArray(questions)) throw new Error("Response is not an array");

    //! 4. save to DB — was completely missing before
    if (session.questions.length > 0) {
      await Question.deleteMany({ session: sessionId });
      session.questions = [];
    }

    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: "",
        isPinned: false,
      })),
    );

    //! 5. attach IDs to session
    session.questions = saved.map((q) => q._id);
    await session.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const ai = getAiClient();
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const explanation = extractJson(response.text, "object");

    // Validate the response structure
    if (!explanation.title || !explanation.explanation) {
      throw new Error("Response missing required fields: title and explanation");
    }

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions"); // ← this was missing

    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
