"use client";
// Candidate list component for employer exam review in the assessment client.
// Displays attempt details and performance status in a table.

import { Users } from "lucide-react";
// Imports reusable UI.
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateExamAttempt } from "@/types";

interface CandidateListProps {
  attempts: CandidateExamAttempt[];
}

const statusColors: Record<string, string> = {
  completed: "bg-success text-success-foreground",
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-info text-info-foreground",
  violated: "bg-destructive text-destructive-foreground",
};

// Displays candidate attempt rows for employer review.
export const CandidateList = ({ attempts }: CandidateListProps) => {
  if (attempts.length === 0) {
    return (
      <div className="flex animate-fade-in flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-body text-muted-foreground">
          No candidates found for this exam.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-display">Name</TableHead>
            <TableHead className="font-display">Email</TableHead>
            <TableHead className="font-display">Status</TableHead>
            <TableHead className="text-right font-display">Score</TableHead>
            <TableHead className="text-right font-display">
              Violations
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => (
            <TableRow
              key={attempt.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">
                {attempt.candidateName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {attempt.candidateEmail}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[attempt.status] || ""}>
                  {attempt.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-display font-semibold">
                {attempt.score !== undefined ? `${attempt.score}%` : "-"}
              </TableCell>
              <TableCell className="text-right">
                {attempt.violations}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

