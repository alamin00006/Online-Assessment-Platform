import { UseFormReturn } from "react-hook-form";
import { Pencil } from "lucide-react";
import { BasicExamInfoForm } from "@/schemas/exam.schema";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BasicInfoPreviewProps {
  methods: UseFormReturn<BasicExamInfoForm>;
  questionSetCount: number;
  onCancel: () => void;
  onEdit: () => void;
  onContinue: () => void;
}

// Shows the saved basic exam information before question setup.
export const BasicInfoPreview = ({
  methods,
  questionSetCount,
  onCancel,
  onEdit,
  onContinue,
}: BasicInfoPreviewProps) => {
  const values = methods.watch();

  return (
    <div className="mx-auto max-w-[954px] space-y-4 animate-fade-in">
      <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[18px] font-semibold text-[#334155]">
              Basic Information
            </h2>
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-1 text-[14px] text-[#94a3b8]">
                Online Test Title
              </p>
              <p className="text-[16px] font-medium leading-[1.4] text-[#334155]">
                {values.title || "-"}
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-4 md:grid-cols-4">
              <PreviewItem
                label="Total Candidates"
                value={values.totalCandidates}
              />
              <PreviewItem label="Total Slots" value={values.totalSlots} />
              <PreviewItem
                label="Total Question Set"
                value={String(questionSetCount)}
              />
              <PreviewItem
                label="Duration Per Slots (Minutes)"
                value={values.duration}
              />
            </div>

            <div className="grid gap-x-8 gap-y-4 md:grid-cols-3">
              <PreviewItem
                label="Question Type"
                value={values.questionType}
                uppercase
              />
              <PreviewItem label="Start Time" value={values.startTime} />
              <PreviewItem label="End Time" value={values.endTime} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-[40px] min-w-[120px] rounded-[10px] border-[#e2e8f0] text-sm font-medium text-[#475569] hover:bg-[#f8fafc]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onContinue}
            className="h-[40px] min-w-[124px] rounded-[10px] bg-primary text-sm font-medium text-primary-foreground shadow-none hover:bg-primary/90"
          >
            Save & Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Displays one labelled value inside the basic information preview.
const PreviewItem = ({
  label,
  value,
  uppercase,
}: {
  label: string;
  value?: string;
  uppercase?: boolean;
}) => {
  return (
    <div>
      <p className="mb-1 text-[14px] text-[#94a3b8]">{label}</p>
      <p
        className={`text-[15px] font-medium text-[#334155] ${
          uppercase ? "uppercase" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
};
