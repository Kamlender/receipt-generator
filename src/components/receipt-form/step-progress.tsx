'use client';

// ============================================================
// Step Progress Bar — Shows current form step
// ============================================================

import { FORM_STEPS, FormStep } from '@/types/receipt';

interface StepProgressProps {
  currentStep: FormStep;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const currentIndex = FORM_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {FORM_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                      : isCurrent
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-4 ring-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium hidden sm:block transition-colors
                    ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < FORM_STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-1 rounded-full overflow-hidden bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500 w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
