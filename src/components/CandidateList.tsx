"use client";

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CandidateExamAttempt } from '@/types';

interface CandidateListProps {
  attempts: CandidateExamAttempt[];
}

const statusColors: Record<string, string> = {
  completed: 'bg-success text-success-foreground',
  pending: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-info text-info-foreground',
  violated: 'bg-destructive text-destructive-foreground',
};

export function CandidateList({ attempts }: CandidateListProps) {
  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="rounded-full bg-muted p-4 mb-4">
          <span className="text-3xl">👥</span>
        </div>
        <p className="text-muted-foreground font-body">No candidates found for this exam.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-display">Name</TableHead>
            <TableHead className="font-display">Email</TableHead>
            <TableHead className="font-display">Status</TableHead>
            <TableHead className="font-display text-right">Score</TableHead>
            <TableHead className="font-display text-right">Violations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((a) => (
            <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{a.candidateName}</TableCell>
              <TableCell className="text-muted-foreground">{a.candidateEmail}</TableCell>
              <TableCell>
                <Badge className={statusColors[a.status] || ''}>{a.status}</Badge>
              </TableCell>
              <TableCell className="text-right font-display font-semibold">
                {a.score !== undefined ? `${a.score}%` : '—'}
              </TableCell>
              <TableCell className="text-right">{a.violations}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
