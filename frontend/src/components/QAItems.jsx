import { useState } from "react";
import ReactMarkdown from "react-markdown";

const QAItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 rounded shadow bg-white p-4 transition hover:shadow-md">
      <div className="flex items-center">
        <h3
          className="flex-1 cursor-pointer font-medium"
          onClick={() => setOpen(!open)}
        >
          {item.question}
        </h3>
      </div>

      {open && (
        <div className="mt-3 text-gray-700">
          <ReactMarkdown>{item.answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default QAItem;
