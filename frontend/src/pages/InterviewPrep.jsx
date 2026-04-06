import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import toast, { Toaster } from "react-hot-toast";
import { FiDownload } from "react-icons/fi";
import { useParams } from "react-router-dom";

import QAItem from "../components/QAItems";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import GenerateButton from "../components/GenerateButton";
import SkeletonCard from "../components/SkeletonCard";
import { API_PATHS } from "../utils/apiPaths";

import axios from "../utils/axiosInstance";

const parseError = (err) => {
  console.log(err);
  if (err.response)
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      `Server error: ${err.response.status}`
    );
  if (err.request) return "Cannot reach server. Check your connection.";
  return err.message || "Something went wrong.";
};

const InterviewPrep = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(`${API_PATHS.SESSION.GET_ONE}/${id}`);
      setSession(res.data.session);
      setQuestions(res.data.session.questions || []);
    } catch (err) {
      console.log(err.response);
      setFetchError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      await axios.post(API_PATHS.AI.GENERATE_QUESTIONS, { sessionId: id });
      await fetchQuestions();
      toast.success("Questions generated!");
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setGenerating(false);
    }
  };

  const downloadQuestionsAsPdf = () => {
    if (!session || questions.length === 0) {
      toast.error("Generate questions before downloading the PDF.");
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 48;
    const contentWidth = pageWidth - marginX * 2;
    let currentY = 56;

    const ensureSpace = (requiredHeight = 24) => {
      if (currentY + requiredHeight <= pageHeight - 48) {
        return;
      }

      pdf.addPage();
      currentY = 56;
    };

    const addWrappedText = (text, options = {}) => {
      const {
        fontSize = 11,
        fontStyle = "normal",
        color = [51, 65, 85],
        lineGap = 8,
      } = options;

      pdf.setFont("helvetica", fontStyle);
      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);

      const lines = pdf.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize + 4;

      ensureSpace(lines.length * lineHeight + lineGap);
      pdf.text(lines, marginX, currentY);
      currentY += lines.length * lineHeight + lineGap;
    };

    pdf.setFillColor(249, 115, 22);
    pdf.roundedRect(marginX, currentY - 20, contentWidth, 64, 16, 16, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("Interview Questions", marginX + 20, currentY + 6);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(
      `${session.role} | ${session.experience}`,
      marginX + 20,
      currentY + 28,
    );
    currentY += 72;

    if (session.topicsToFocus) {
      addWrappedText(`Focus: ${session.topicsToFocus}`, {
        fontSize: 11,
        fontStyle: "bold",
        color: [234, 88, 12],
      });
    }

    if (session.description) {
      addWrappedText(`Session Notes: ${session.description}`, {
        fontSize: 10,
        color: [100, 116, 139],
        lineGap: 14,
      });
    }

    questions.forEach((item, index) => {
      addWrappedText(`${index + 1}. ${item.question}`, {
        fontSize: 13,
        fontStyle: "bold",
        color: [15, 23, 42],
        lineGap: 6,
      });

      addWrappedText(item.answer || "Answer not available yet.", {
        fontSize: 11,
        color: [51, 65, 85],
        lineGap: 16,
      });
    });

    const safeRole = (session.role || "interview")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    pdf.save(`${safeRole || "interview"}-questions.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Toaster
        position="top-right"
        toastOptions={{ className: "!text-sm !font-medium" }}
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-1">
              Session ID: {id?.slice(0, 8)}
            </p>
            <h1 className="text-2xl font-bold text-slate-800">
              Interview Questions
            </h1>
            {session ? (
              <p className="mt-1 text-sm text-slate-500">
                {session.role} • {session.experience}
              </p>
            ) : null}
            {!loading && !fetchError && (
              <p className="text-sm text-slate-500 mt-0.5">
                {questions.length > 0
                  ? `${questions.length} question${
                      questions.length !== 1 ? "s" : ""
                    } ready`
                  : "No questions yet"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {questions.length > 0 ? (
              <button
                type="button"
                onClick={downloadQuestionsAsPdf}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
              >
                <FiDownload className="h-4 w-4" />
                Download PDF
              </button>
            ) : null}
            <GenerateButton
              onClick={generateQuestions}
              generating={generating}
              loading={loading}
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-slate-200 mb-8" />

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : fetchError ? (
          <ErrorBanner message={fetchError} onRetry={fetchQuestions} />
        ) : questions.length === 0 ? (
          <EmptyState onGenerate={generateQuestions} generating={generating} />
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <QAItem item={q} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
