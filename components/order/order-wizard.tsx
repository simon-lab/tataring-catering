"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepEvent, type Step1Data } from "./step-event";
import { StepPackage, type Step2Data } from "./step-package";
import { StepLocation, type Step3Data } from "./step-location";
import { StepReview } from "./step-review";
import type { Package, Addon } from "@/types/database";

interface Props {
  packages: Package[];
  addons: Addon[];
  prefillDate?: string;
}

const STEPS = [
  { label: "Acara", description: "Info pemesan & acara" },
  { label: "Paket", description: "Pilih menu & porsi" },
  { label: "Lokasi", description: "Alamat pengiriman" },
  { label: "Review", description: "Konfirmasi pesanan" },
];

export function OrderWizard({ packages, addons, prefillDate }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);

  const handleStep1Complete = (data: Step1Data) => {
    setStep1Data(data);
    setStep(1);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setStep2Data(data);
    setStep(2);
  };

  const handleStep3Complete = (data: Step3Data) => {
    setStep3Data(data);
    setStep(3);
  };

  const handleSuccess = (orderNumber: string) => {
    router.push(`/order/success?order=${orderNumber}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Step indicator */}
      <nav aria-label="Progress" className="mb-10">
        <ol className="flex items-center">
          {STEPS.map((s, i) => {
            const isCompleted = i < step;
            const isActive = i === step;
            return (
              <li key={s.label} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                        ? "border-primary bg-background text-primary"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="size-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-medium sm:block",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 mb-5 h-0.5 flex-1 transition-colors",
                      i < step ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step title */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Langkah {step + 1} dari {STEPS.length}
        </p>
        <h2 className="mt-1 font-heading text-2xl text-foreground">
          {STEPS[step].description}
        </h2>
      </div>

      {/* Step content */}
      {step === 0 && (
        <StepEvent
          defaultValues={
            step1Data
              ? step1Data
              : prefillDate
              ? { eventDate: prefillDate }
              : undefined
          }
          onComplete={handleStep1Complete}
        />
      )}

      {step === 1 && (
        <StepPackage
          packages={packages}
          addons={addons}
          eventType={step1Data?.eventType}
          defaultValues={step2Data ?? undefined}
          onComplete={handleStep2Complete}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <StepLocation
          defaultValues={step3Data ?? undefined}
          onComplete={handleStep3Complete}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && step1Data && step2Data && step3Data && (
        <StepReview
          step1={step1Data}
          step2={step2Data}
          step3={step3Data}
          onBack={() => setStep(2)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
