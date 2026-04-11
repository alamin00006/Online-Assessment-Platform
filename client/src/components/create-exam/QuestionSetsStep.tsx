import { Dispatch, SetStateAction } from "react";
import { Check, Loader2 } from "lucide-react";
import { QuestionEditor } from "@/components/shared";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const activeQuestionSet = editingQuestion
    ? questionSets.find((questionSet) => questionSet.id === editingQuestion.setId)
    : undefined;

  // Saves the active modal question and closes the modal when the flow is complete.
  const handleModalSave = (question: Question) => {
    if (!activeQuestionSet) return;

    onAddQuestion(activeQuestionSet.id, question);
    setEditingQuestion(null);
  };

  // Saves the active modal question while keeping the modal ready for another entry.
  const handleModalSaveAndAddMore = (question: Question) => {
    if (!activeQuestionSet) return;

    onAddQuestion(activeQuestionSet.id, question);
    setEditingQuestion({ setId: activeQuestionSet.id });
  };

  return (
    <div className="mx-auto max-w-[760px] space-y-5 animate-fade-in">
      {questionSets.map((questionSet) => (
        <div key={questionSet.id} className="space-y-4">
          {questionSet.questions.map((question, questionIndex) => (
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
          ))}
        </div>
      ))}

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
            onClick={() =>
              setEditingQuestion({ setId: questionSets[0]?.id ?? "" })
            }
            className="h-[38px] w-full rounded-[8px] bg-primary text-[12px] font-semibold text-primary-foreground shadow-none hover:bg-primary/90"
          >
            Add Question
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editingQuestion)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingQuestion(null);
        }}
      >
        <DialogContent
          hideCloseButton
          className="max-h-[88vh] max-w-[760px] overflow-y-auto rounded-[14px] border-none bg-transparent p-0 shadow-none"
        >
          <DialogHeader>
            <DialogTitle className="sr-only">
              {editingQuestion?.question ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>
          {activeQuestionSet ? (
            <QuestionEditor
              initialData={editingQuestion?.question}
              onSave={handleModalSave}
              onSaveAndAddMore={handleModalSaveAndAddMore}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};
