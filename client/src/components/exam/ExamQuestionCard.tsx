// Imports reusable UI.
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Question } from "@/types";

interface ExamQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
  onSkip: () => void;
  onNext: () => void;
}

// Renders the current exam question and answer submission controls.
export const ExamQuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  answers,
  onAnswerChange,
  onSkip,
  onNext,
}: ExamQuestionCardProps) => (
  <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
    <CardContent className="space-y-5 p-3 sm:space-y-6 sm:p-5">
      <h2
        className="font-display text-[17px] font-semibold leading-[1.45] text-[#334155] sm:text-[22px]"
        dangerouslySetInnerHTML={{
          __html: `Q${questionNumber + 1}. ${question.title}`,
        }}
      />

      {question.type === "radio" && question.options && (
        <RadioGroup
          value={(answers[question.id] as string) || ""}
          onValueChange={(value) => onAnswerChange(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <label
              key={option}
              htmlFor={`${question.id}-${option}`}
              className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#e8edf4] px-3 py-3 text-[12px] text-[#475569] transition-colors hover:bg-[#fafbfc] sm:px-4 sm:text-sm"
            >
              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
              <span>{option}</span>
            </label>
          ))}
        </RadioGroup>
      )}

      {question.type === "checkbox" && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => {
            const selected = (answers[question.id] as string[]) || [];

            return (
              <label
                key={option}
                htmlFor={`${question.id}-${option}`}
                className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#e8edf4] px-3 py-3 text-[12px] text-[#475569] transition-colors hover:bg-[#fafbfc] sm:px-4 sm:text-sm"
              >
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={selected.includes(option)}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option);
                    onAnswerChange(question.id, next);
                  }}
                  className="h-[14px] w-[14px] rounded-[3px] border-[#cbd5e1] data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.type === "text" && (
        <RichTextEditor
          content={(answers[question.id] as string) || ""}
          onChange={(value) => onAnswerChange(question.id, value)}
          placeholder="Type questions here..."
          minHeight="140px"
        />
      )}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={questionNumber >= totalQuestions - 1}
          className="h-[42px] w-full rounded-[10px] border-[#d7dee7] px-4 text-sm font-medium text-[#475569] sm:h-[38px] sm:w-auto sm:rounded-[8px]"
        >
          Skip this Question
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="h-[42px] w-full rounded-[10px] bg-primary px-5 text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/90 sm:h-[38px] sm:w-auto sm:rounded-[8px]"
        >
          {questionNumber < totalQuestions - 1 ? "Save & Continue" : "Submit"}
        </Button>
      </div>
    </CardContent>
  </Card>
);




