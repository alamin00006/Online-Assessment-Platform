// Imports reusable UI.
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextDisplay, RichTextEditor } from "@/components/shared";
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
      <h2 className="font-display text-[17px] font-semibold leading-[1.45] text-[#334155] sm:text-[22px]">
        <span>Q{questionNumber + 1}. </span>
        <RichTextDisplay
          html={question.title}
          inlineParagraphs
          className="align-baseline"
        />
      </h2>

      {question.type === "radio" && question.options && (
        <RadioGroup
          value={(answers[question.id] as string) || ""}
          onValueChange={(value) => onAnswerChange(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option, optionIndex) => {
            const optionId = `${question.id}-option-${optionIndex}`;

            return (
              <label
                key={optionId}
                htmlFor={optionId}
                className="flex cursor-pointer items-start gap-3 rounded-[8px] border border-[#e8edf4] px-3 py-3 text-[12px] text-[#475569] transition-colors hover:bg-[#fafbfc] sm:px-4 sm:text-sm"
              >
                <RadioGroupItem
                  value={option}
                  id={optionId}
                  className="mt-0.5"
                />
                <RichTextDisplay html={option} className="flex-1 leading-5" />
              </label>
            );
          })}
        </RadioGroup>
      )}

      {question.type === "checkbox" && question.options && (
        <div className="space-y-3">
          {question.options.map((option, optionIndex) => {
            const selected = (answers[question.id] as string[]) || [];
            const optionId = `${question.id}-option-${optionIndex}`;

            return (
              <label
                key={optionId}
                htmlFor={optionId}
                className="flex cursor-pointer items-start gap-3 rounded-[8px] border border-[#e8edf4] px-3 py-3 text-[12px] text-[#475569] transition-colors hover:bg-[#fafbfc] sm:px-4 sm:text-sm"
              >
                <Checkbox
                  id={optionId}
                  checked={selected.includes(option)}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option);
                    onAnswerChange(question.id, next);
                  }}
                  className="mt-0.5 h-[14px] w-[14px] rounded-[3px] border-[#cbd5e1] data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <RichTextDisplay html={option} className="flex-1 leading-5" />
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
