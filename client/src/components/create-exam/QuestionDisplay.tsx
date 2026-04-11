import { CheckCircle2 } from "lucide-react";
import { Question } from "@/types";

interface QuestionDisplayProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onRemove: () => void;
}

// Renders a saved question with answer choices and management actions.
export const QuestionDisplay = ({
question,
  index,
  onEdit,
  onRemove,
}: QuestionDisplayProps) => {
  const correctAnswers = question.correctAnswer
    ? Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer]
    : [];

  const typeLabel =
    question.type === "radio"
      ? "MCQ"
      : question.type === "checkbox"
        ? "Checkbox"
        : "Text";

  return (
    <div className="space-y-4 rounded-[12px] border border-[#edf1f7] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#334155]">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-[#94a3b8]">
          <span className="rounded-full border border-[#e2e8f0] px-2 py-0.5">
            {typeLabel}
          </span>
          <span className="rounded-full border border-[#e2e8f0] px-2 py-0.5">
            {question.points || 1} pt
          </span>
        </div>
      </div>

      <div
        className="text-[13px] font-semibold text-[#1e293b]"
        dangerouslySetInnerHTML={{ __html: question.title }}
      />

      {question.type !== "text" && question.options && (
        <div className="space-y-2">
          {question.options.map((option, optionIndex) => {
            const isCorrect = correctAnswers.includes(option);

            return (
              <div
                key={optionIndex}
                className={`flex items-center gap-3 rounded-[6px] px-4 py-2.5 text-[12px] ${
                  isCorrect ? "bg-[#f3f4f6]" : "bg-white"
                }`}
              >
                <span className="font-medium text-[#64748b]">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <span className="flex-1 text-[#334155]">{option}</span>
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {question.type === "text" && (
        <div className="rounded-[8px] bg-[#f8fafc] p-4 text-[11px] leading-5 text-[#64748b]">
          Text answer field
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => onEdit(question)}
          className="text-[11px] font-medium text-primary hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] font-medium text-[#ef4444] hover:underline"
        >
          Remove From Exam
        </button>
      </div>
    </div>
  );
}


