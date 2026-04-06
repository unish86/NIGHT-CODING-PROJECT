import { BsLightningChargeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { TbBulb } from "react-icons/tb";

const EmptyState = ({ onGenerate, generating }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
      <TbBulb className="w-7 h-7 text-indigo-400" />
    </div>
    <div>
      <p className="text-slate-700 font-semibold text-base">No questions yet</p>
      <p className="text-slate-400 text-sm mt-1">
        Generate AI-powered questions for this session.
      </p>
    </div>
    <button
      onClick={onGenerate}
      disabled={generating}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shadow-sm"
    >
      {generating ? (
        <>
          <ImSpinner8 className="animate-spin w-4 h-4" /> Generating…
        </>
      ) : (
        <>
          <BsLightningChargeFill className="w-4 h-4" /> Generate Questions
        </>
      )}
    </button>
  </div>
);

export default EmptyState;
