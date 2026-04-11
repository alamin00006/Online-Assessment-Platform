"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Question, QuestionType } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const questionSchema = z.object({
  title: z.string().min(3, 'Question must be at least 3 characters'),
  type: z.enum(['radio', 'checkbox', 'text']),
  points: z.string().min(1, 'Points required'),
});

interface QuestionModalProps {
  onSave: (question: Question) => void;
  initialData?: Question;
  trigger?: React.ReactNode;
}

export function QuestionModal({ onSave, initialData, trigger }: QuestionModalProps) {
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

  const toggleCorrectAnswer = (option: string) => {
    if (questionType === 'radio') {
      setCorrectAnswers([option]);
    } else {
      setCorrectAnswers((prev) =>
        prev.includes(option) ? prev.filter((a) => a !== option) : [...prev, option]
      );
    }
  };

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
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => opt && toggleCorrectAnswer(opt)}
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        correctAnswers.includes(opt) && opt
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground/40'
                      }`}
                    >
                      {correctAnswers.includes(opt) && opt && (
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const old = options[i];
                        const updated = [...options];
                        updated[i] = e.target.value;
                        setOptions(updated);
                        // Update correct answers if the option text changed
                        if (correctAnswers.includes(old)) {
                          setCorrectAnswers((prev) =>
                            prev.map((a) => (a === old ? e.target.value : a))
                          );
                        }
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const removed = options[i];
                          setOptions(options.filter((_, j) => j !== i));
                          setCorrectAnswers((prev) => prev.filter((a) => a !== removed));
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
}
