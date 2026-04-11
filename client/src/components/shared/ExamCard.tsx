"use client";

import { Exam } from '@/types';
// Imports reusable UI.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, FileText, Calendar } from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
  variant: 'employer' | 'candidate';
  onAction?: () => void;
  actionLabel?: string;
  extraInfo?: { negativeMarking?: boolean; questionsCount?: number; status?: string; score?: number };
}

// Displays a reusable exam summary card for assessment lists.
export const ExamCard = ({
  exam,
  variant,
  onAction,
  actionLabel,
  extraInfo,
}: ExamCardProps) => {
  const isEmployer = variant === 'employer';
  const totalQuestions = exam.questionSets.reduce(
    (questionTotal, questionSet) =>
      questionTotal + questionSet.questions.length,
    0,
  );

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in ${isEmployer ? 'hover:border-employer/30' : 'hover:border-candidate/30'} border border-border`}>
      <div className={`h-1.5 ${isEmployer ? 'gradient-employer' : 'gradient-candidate'}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-display text-lg leading-tight">{exam.title}</CardTitle>
          <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}
            className={exam.status === 'active' ? (isEmployer ? 'bg-employer text-employer-foreground' : 'bg-candidate text-candidate-foreground') : ''}>
            {extraInfo?.status || exam.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{exam.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{totalQuestions} questions</span>
          </div>
          {isEmployer && (
            <>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{exam.totalCandidates} candidates</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{exam.totalSlots} slots</span>
              </div>
            </>
          )}
          {!isEmployer && extraInfo?.negativeMarking !== undefined && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">{extraInfo.negativeMarking ? 'âš ï¸ Negative marking' : 'âœ… No negative marking'}</span>
            </div>
          )}
        </div>
        {extraInfo?.score !== undefined && (
          <div className="rounded-md bg-muted p-2 text-center">
            <span className="text-sm font-medium">Score: </span>
            <span className="font-display text-lg font-bold text-foreground">{extraInfo.score}%</span>
          </div>
        )}
        {onAction && (
          <Button onClick={onAction} className={`w-full ${isEmployer ? 'bg-employer hover:bg-employer-accent text-employer-foreground' : 'bg-candidate hover:bg-candidate-accent text-candidate-foreground'}`}>
            {actionLabel || 'View'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};


