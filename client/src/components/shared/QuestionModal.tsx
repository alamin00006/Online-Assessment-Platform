"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Question, QuestionType } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { questionSchema } from '@/schemas/question.schema';


interface QuestionModalProps {
  onSave: (question: Question) => void;
  initialData?: Question;
  trigger?: React.ReactNode;
}

// Displays the modal shell for creating and editing exam questions.
export const QuestionModal = ({
  onSave,
  initialData,
  trigger,
}: QuestionModalProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>(initialData?.options || ['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(
    initialData?.correctAnswer
      ? Array.isArray(initialData.correctAnswer)
        ? initialData.correctAnswer
        : [initialData.correctAnswer]
      : []
  );
  const [questionType, setQuestionType] = useState<QuestionType>(initialData?.type || 'radio');

  const methods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'radio',
      points: String(initialData?.points || 1),
    },
  });

  // Hydrates modal form state when editing an existing question.
  useEffect(() => {
    if (open && initialData) {
      methods.reset({
        title: initialData.title,
        type: initialData.type,
        points: String(initialData.points || 1),
      });
      setOptions(initialData.options || ['', '', '', '']);
      setQuestionType(initialData.type);
      setCorrectAnswers(
        initialData.correctAnswer
          ? Array.isArray(initialData.correctAnswer)
            ? initialData.correctAnswer
            : [initialData.correctAnswer]
          : []
      );
    }
  }, [open, initialData, methods]);

  // Updates the modal correct-answer state for radio and checkbox questions.
  const toggleCorrectAnswer = (option: string) => {
    if (questionType === 'radio') {
      setCorrectAnswers([option]);
    } else {
      setCorrectAnswers((currentCorrectAnswers) =>
        currentCorrectAnswers.includes(option)
          ? currentCorrectAnswers.filter((answerId) => answerId !== option)
          : [...currentCorrectAnswers, option]
      );
    }
  };

  // Builds a question from modal form data and passes it back to the parent flow.
  const handleSubmit = methods.handleSubmit((data) => {
    const question: Question = {
      id: initialData?.id || `q-${Date.now()}`,
      title: data.title,
      type: data.type as QuestionType,
      points: parseInt(data.points, 10),
      ...(data.type !== 'text'
        ? {
            options: options.filter(Boolean),
            correctAnswer: questionType === 'radio' ? correctAnswers[0] : correctAnswers,
          }
        : {}),
    };
    onSave(question);
    setOpen(false);
    methods.reset({ title: '', type: 'radio', points: '1' });
    setOptions(['', '', '', '']);
    setCorrectAnswers([]);
    setQuestionType('radio');
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold">
            Add Question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? 'Edit' : 'Add'} Question</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Question Title</Label>
              <Input {...methods.register('title')} placeholder="Enter question..." />
              {methods.formState.errors.title && (
                <p className="text-xs text-destructive">{methods.formState.errors.title.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={questionType}
                  onValueChange={(v) => {
                    setQuestionType(v as QuestionType);
                    methods.setValue('type', v as QuestionType);
                    setCorrectAnswers([]);
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="radio">MCQ</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Points</Label>
                <Input {...methods.register('points')} type="number" min="1" placeholder="1" />
                {methods.formState.errors.points && (
                  <p className="text-xs text-destructive">{methods.formState.errors.points.message}</p>
                )}
              </div>
            </div>
            {questionType !== 'text' && (
              <div className="space-y-3">
                <Label>Options (click to mark correct answer)</Label>
                {options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => option && toggleCorrectAnswer(option)}
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        correctAnswers.includes(option) && option
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground/40'
                      }`}
                    >
                      {correctAnswers.includes(option) && option && (
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const previousOption = options[optionIndex];
                        const updated = [...options];
                        updated[optionIndex] = e.target.value;
                        setOptions(updated);
                        // Update correct answers if the option text changed
                        if (correctAnswers.includes(previousOption)) {
                          setCorrectAnswers((currentCorrectAnswers) =>
                            currentCorrectAnswers.map((answerId) =>
                              answerId === previousOption
                                ? e.target.value
                                : answerId
                            )
                          );
                        }
                      }}
                      placeholder={`Option ${String.fromCharCode(
                        65 + optionIndex,
                      )}`}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const removedOption = options[optionIndex];
                          setOptions(
                            options.filter(
                              (_, currentOptionIndex) =>
                                currentOptionIndex !== optionIndex
                            )
                          );
                          setCorrectAnswers((currentCorrectAnswers) =>
                            currentCorrectAnswers.filter(
                              (answerId) => answerId !== removedOption
                            )
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOptions([...options, ''])}
                  className="text-primary"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Option
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {initialData ? 'Update' : 'Add'} Question
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};


