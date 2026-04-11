import { Dispatch, SetStateAction } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { Clock3 } from "lucide-react";
import { BasicExamInfoForm } from "@/schemas/exam.schema";
import { QuestionSet } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "./FormField";

interface BasicInfoFormProps {
  methods: UseFormReturn<BasicExamInfoForm>;
  questionSets: QuestionSet[];
  setQuestionSets: Dispatch<SetStateAction<QuestionSet[]>>;
  negativeMarking: boolean;
  setNegativeMarking: (value: boolean) => void;
  onCancel: () => void;
  onSave: () => void;
}

// Collects and validates the basic exam configuration fields.
export const BasicInfoForm = ({
  methods,
  questionSets,
  setQuestionSets,
  negativeMarking,
  setNegativeMarking,
  onCancel,
  onSave,
}: BasicInfoFormProps) => {
  const values = methods.watch();
  const errors = methods.formState.errors;

  // Synchronizes the selected question set count with the editable question set state.
  const updateQuestionSetCount = (value: string) => {
    const count = Number.parseInt(value, 10);

    setQuestionSets((currentQuestionSets) => {
      if (count > currentQuestionSets.length) {
        const updatedQuestionSets = [...currentQuestionSets];
        for (
          let questionSetIndex = currentQuestionSets.length;
          questionSetIndex < count;
          questionSetIndex += 1
        ) {
          updatedQuestionSets.push({
            id: `qs-${Date.now()}-${questionSetIndex}`,
            name: `Question Set ${questionSetIndex + 1}`,
            questions: [],
          });
        }
        return updatedQuestionSets;
      }

      return currentQuestionSets.slice(0, count);
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-[720px] space-y-4 animate-fade-in">
        <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <h2 className="font-display text-[22px] font-semibold text-[#334155]">
              Basic Information
            </h2>

            <form className="space-y-4">
              <FormField
                label="Online Test Title"
                required
                error={errors.title?.message}
              >
                <Input
                  {...methods.register("title")}
                  placeholder="Enter online test title"
                  className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                />
              </FormField>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  label="Total Candidates"
                  required
                  error={errors.totalCandidates?.message}
                >
                  <Input
                    {...methods.register("totalCandidates")}
                    type="number"
                    placeholder="Enter total candidates"
                    className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                  />
                </FormField>

                <FormField
                  label="Total Slots"
                  required
                  error={errors.totalSlots?.message}
                >
                  <Select
                    value={values.totalSlots}
                    onValueChange={(value) =>
                      methods.setValue("totalSlots", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm text-[#334155]">
                      <SelectValue placeholder="Select total shots" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((slotCount) => (
                        <SelectItem key={slotCount} value={String(slotCount)}>
                          {slotCount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Total Question Set" required>
                  <Select
                    value={String(questionSets.length)}
                    onValueChange={updateQuestionSetCount}
                  >
                    <SelectTrigger className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm text-[#334155]">
                      <SelectValue placeholder="Select total question set" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((questionSetCount) => (
                        <SelectItem
                          key={questionSetCount}
                          value={String(questionSetCount)}
                        >
                          {questionSetCount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField
                  label="Question Type"
                  required
                  error={errors.questionType?.message}
                >
                  <Select
                    value={values.questionType}
                    onValueChange={(value) =>
                      methods.setValue("questionType", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm text-[#334155]">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">MCQ</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_150px]">
                <FormField
                  label="Start Time"
                  required
                  error={errors.startTime?.message}
                >
                  <div className="relative">
                    <Input
                      {...methods.register("startTime")}
                      type="datetime-local"
                      className="h-[42px] rounded-[8px] border-[#e2e8f0] pr-10 text-sm text-[#334155] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                    />
                    <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </FormField>

                <FormField
                  label="End Time"
                  required
                  error={errors.endTime?.message}
                >
                  <div className="relative">
                    <Input
                      {...methods.register("endTime")}
                      type="datetime-local"
                      className="h-[42px] rounded-[8px] border-[#e2e8f0] pr-10 text-sm text-[#334155] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                    />
                    <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </FormField>

                <FormField label="Duration" error={errors.duration?.message}>
                  <Input
                    {...methods.register("duration")}
                    type="number"
                    placeholder="Duration Time"
                    className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                  />
                </FormField>
              </div>

              <div className="flex items-center justify-between rounded-[10px] border border-[#eef2f7] bg-[#fbfcfe] px-4 py-3">
                <Label className="text-sm font-medium text-[#475569]">
                  Negative Marking
                </Label>
                <Switch
                  checked={negativeMarking}
                  onCheckedChange={setNegativeMarking}
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-[40px] min-w-[122px] rounded-[10px] border-[#e2e8f0] text-sm font-medium text-[#475569] hover:bg-[#f8fafc]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              className="h-[40px] min-w-[122px] rounded-[10px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] text-sm font-medium text-white shadow-none hover:opacity-95"
            >
              Save & Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};
