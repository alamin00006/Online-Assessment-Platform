import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { Clock3 } from "lucide-react";
import { BasicExamInfoForm } from "@/schemas/exam.schema";
import { QuestionSet } from "@/types";
// Imports reusable UI.
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

// Reusable className constants
const SELECT_TRIGGER_CLASSES =
  "h-[42px] rounded-[8px] border-[#e2e8f0] text-[14px] text-[#334155]";
const INPUT_BASE_CLASSES =
  "h-[42px] rounded-[8px] border-[#e2e8f0] text-[14px] placeholder:text-[#c0c7d4]";
const FOCUS_RING_CLASSES =
  "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0";
const TIME_INPUT_CLASSES = `${INPUT_BASE_CLASSES} pr-10 text-[#334155] ${FOCUS_RING_CLASSES} [&::-webkit-calendar-picker-indicator]:opacity-0`;
const DURATION_INPUT_CLASSES =
  "h-[42px] cursor-default rounded-[8px] border-[#e2e8f0] bg-[#f8fafc] text-[14px] text-[#334155] placeholder:text-[#c0c7d4] focus-visible:ring-0 focus-visible:ring-offset-0";

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
  const { startTime, endTime, duration } = values;
  const errors = methods.formState.errors;
  const startTimeInputRef = useRef<HTMLInputElement | null>(null);
  const endTimeInputRef = useRef<HTMLInputElement | null>(null);
  const startTimeField = methods.register("startTime");
  const endTimeField = methods.register("endTime");
  const durationLabel = duration ? `${duration} minutes` : "";

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "";

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    return durationMinutes > 0 ? String(durationMinutes) : "";
  };

  // Keeps duration synchronized with the selected start and end times.
  useEffect(() => {
    const calculatedDuration = calculateDuration(startTime, endTime);

    methods.setValue("duration", calculatedDuration, {
      shouldDirty: true,
      shouldValidate: Boolean(calculatedDuration),
    });
  }, [methods, startTime, endTime]);

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
      <div className="mx-auto max-w-[954px] space-y-4 animate-fade-in">
        <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <h2 className="font-display text-[18px] font-semibold text-[#334155]">
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
                  className={`${INPUT_BASE_CLASSES} ${FOCUS_RING_CLASSES}`}
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
                    className={`${INPUT_BASE_CLASSES} ${FOCUS_RING_CLASSES}`}
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
                    <SelectTrigger className={SELECT_TRIGGER_CLASSES}>
                      <SelectValue placeholder="Select total slots" />
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
                    <SelectTrigger className={SELECT_TRIGGER_CLASSES}>
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
                    <SelectTrigger className={SELECT_TRIGGER_CLASSES}>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">MCQ</SelectItem>
                      <SelectItem value="written">Written</SelectItem>
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
                      {...startTimeField}
                      ref={(element) => {
                        startTimeField.ref(element);
                        startTimeInputRef.current = element;
                      }}
                      type="time"
                      placeholder="Enter start time"
                      className={TIME_INPUT_CLASSES}
                    />
                    <button
                      type="button"
                      aria-label="Choose start time"
                      onClick={() => {
                        startTimeInputRef.current?.showPicker?.();
                        startTimeInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors hover:text-primary"
                    >
                      <Clock3 className="h-4 w-4" />
                    </button>
                  </div>
                </FormField>

                <FormField
                  label="End Time"
                  required
                  error={errors.endTime?.message}
                >
                  <div className="relative">
                    <Input
                      {...endTimeField}
                      ref={(element) => {
                        endTimeField.ref(element);
                        endTimeInputRef.current = element;
                      }}
                      type="time"
                      placeholder="Enter end time"
                      className={TIME_INPUT_CLASSES}
                    />
                    <button
                      type="button"
                      aria-label="Choose end time"
                      onClick={() => {
                        endTimeInputRef.current?.showPicker?.();
                        endTimeInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors hover:text-primary"
                    >
                      <Clock3 className="h-4 w-4" />
                    </button>
                  </div>
                </FormField>

                <FormField label="Duration" error={errors.duration?.message}>
                  <input type="hidden" {...methods.register("duration")} />
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={durationLabel}
                    placeholder="Duration Time"
                    className={DURATION_INPUT_CLASSES}
                  />
                </FormField>
              </div>

              <div className="flex items-center justify-between rounded-[10px] border border-[#eef2f7] bg-[#fbfcfe] px-4 py-3">
                <Label className="text-[14px] font-medium text-[#475569]">
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
              className="h-[40px] min-w-[122px] rounded-[10px] border-[#e2e8f0] text-[14px] font-medium text-[#475569] hover:bg-[#f8fafc]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              className="h-[40px] min-w-[122px] rounded-[10px] bg-primary text-[14px] font-medium text-primary-foreground shadow-none hover:bg-primary/90"
            >
              Save & Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};
