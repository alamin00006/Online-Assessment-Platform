import { Check } from "lucide-react";

interface CreateExamStepperProps {
  step: number;
  basicInfoSaved: boolean;
  onStepClick: (step: number) => void;
}

// Displays current progress through the exam creation steps.
export const CreateExamStepper = ({
  step,
  basicInfoSaved,
  onStepClick,
}: CreateExamStepperProps) => {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <button
        type="button"
        onClick={() => onStepClick(1)}
        className="flex items-center gap-2 text-primary"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6d4aff] text-[10px] font-semibold text-white">
          {basicInfoSaved ? <Check className="h-2.5 w-2.5" /> : "1"}
        </span>
        <span className="font-medium text-[14px]">Basic Info</span>
      </button>

      <div className="h-px w-[80px] bg-black" />

      <button
        type="button"
        onClick={() => onStepClick(2)}
        className={`flex items-center gap-2 ${
          step === 2 ? "text-primary" : "text-[#94a3b8]"
        }`}
      >
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${
            step === 2
              ? "bg-[#6d4aff] text-white"
              : "bg-[#e2e8f0] text-[#94a3b8]"
          }`}
        >
          {step === 2 ? <Check className="h-2.5 w-2.5" /> : "2"}
        </span>
        <span className="font-medium text-[14px]">Questions</span>
      </button>
    </div>
  );
};
