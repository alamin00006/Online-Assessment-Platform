import { Dispatch, SetStateAction } from "react";
import { Check, Loader2 } from "lucide-react";
import { QuestionEditor } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Question, QuestionSet } from "@/types";
import { QuestionDisplay } from "./QuestionDisplay";

export interface EditingQuestionState {
  setId: string;
  question?: Question;
}

interface QuestionSetsStepProps {
  questionSets: QuestionSet[];
  editingQuestion: EditingQuestionState | null;
  setEditingQuestion: Dispatch<SetStateAction<EditingQuestionState | null>>;
  totalQuestions: number;
  isSaving: boolean;
  onAddQuestion: (setId: string, question: Question) => void;
  onDeleteQuestion: (setId: string, questionId: string) => void;
  onSaveExam: () => void;
}

// Manages the question set step and launches the question editor modal.
export const QuestionSetsStep = ({
  questionSets,
  editingQuestion,
  setEditingQuestion,
  totalQuestions,
  isSaving,
  onAddQuestion,
  onDeleteQuestion,
  onSaveExam,
}: QuestionSetsStepProps) => {
  return (
    <div className="mx-auto max-w-[760px] space-y-5 animate-fade-in">
      {questionSets.map((questionSet) => (
        <div key={questionSet.id} className="space-y-4">
          {questionSet.questions.map((question, questionIndex) =>
            editingQuestion?.setId === questionSet.id &&
            editingQuestion?.question?.id === question.id ? (
              <QuestionEditor
                key={question.id}
                initialData={question}
                onSave={(updatedQuestion) => {
                  onAddQuestion(questionSet.id, updatedQuestion);
                  setEditingQuestion(null);
                }}
                onSaveAndAddMore={(updatedQuestion) => {
                  onAddQuestion(questionSet.id, updatedQuestion);
                }}
                onCancel={() => setEditingQuestion(null)}
              />
            ) : (
              <QuestionDisplay
                key={question.id}
                question={question}
                index={questionIndex}
                onEdit={() =>
                  setEditingQuestion({
                    setId: questionSet.id,
                    question,
                  })
                }
                onRemove={() => onDeleteQuestion(questionSet.id, question.id)}
              />
            ),
          )}

          {editingQuestion?.setId === questionSet.id &&
          !editingQuestion?.question ? (
            <QuestionEditor
              onSave={(question) => {
                onAddQuestion(questionSet.id, question);
                setEditingQuestion(null);
              }}
              onSaveAndAddMore={(question) => {
                onAddQuestion(questionSet.id, question);
                setEditingQuestion({ setId: questionSet.id });
              }}
              onCancel={() => setEditingQuestion(null)}
            />
          ) : null}
        </div>
      ))}

      {!editingQuestion && (
        <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
          <CardContent className="space-y-3 p-4">
            {totalQuestions > 0 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveExam}
                  disabled={isSaving}
                  className="h-[36px] rounded-[8px] border-[#e2e8f0] px-4 text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc]"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-3.5 w-3.5" />
                  )}
                  Save Online Test
                </Button>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setEditingQuestion({ setId: questionSets[0]?.id })}
              className="h-[38px] w-full rounded-[8px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] text-[12px] font-semibold text-white shadow-none hover:opacity-95"
            >
              Add Question
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};



