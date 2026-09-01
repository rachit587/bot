'use client';

interface Step {
  id: string;
  label: string;
}

export default function StepProgress({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="relative">
      {/* Desktop: full labels */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-bot-gold text-bot-bg'
                    : i === currentStep
                    ? 'bg-bot-gold text-bot-bg animate-pulse-gold'
                    : 'bg-bot-elevated text-bot-text-secondary border border-bot-border'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium transition-colors ${
                  i <= currentStep ? 'text-bot-gold' : 'text-bot-text-secondary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2 mt-[-18px]">
                <div className="h-px bg-bot-border relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-bot-gold transition-all duration-500"
                    style={{ width: i < currentStep ? '100%' : '0%', height: '1px' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-bot-gold">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-bot-text-secondary">{steps[currentStep]?.label}</span>
        </div>
        <div className="h-1.5 bg-bot-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-gold rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
