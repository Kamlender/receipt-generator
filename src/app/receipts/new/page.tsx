'use client';

// ============================================================
// Receipt Generation Page — Multi-Step Form
// ============================================================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/components/auth-provider';
import { signOut } from '@/lib/firebase/auth';
import { receiptFormSchema, ReceiptFormValues } from '@/lib/validation/receipt-schema';
import { createReceipt, initializeSequence } from '@/lib/firebase/firestore';
import { FormStep, FORM_STEPS } from '@/types/receipt';

import { StepProgress } from '@/components/receipt-form/step-progress';
import { DonorDetails } from '@/components/receipt-form/donor-details';
import { DonationDetails } from '@/components/receipt-form/donation-details';
import { PaymentDetails } from '@/components/receipt-form/payment-details';
import { ReviewStep } from '@/components/receipt-form/review-step';

/** Fields to validate for each step before allowing Next */
const STEP_FIELDS: Record<number, (keyof ReceiptFormValues)[]> = {
  0: ['donorName', 'donorAddress', 'donorPan', 'donorContact', 'donorEmail'],
  1: ['amount', 'donationDate'],
  2: ['paymentMode', 'paymentReference'],
};

function ReceiptFormContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Redirect Admin to /admin if they somehow land here
  useEffect(() => {
    if (user?.email === 'jeevanta@gmail.com') {
      router.replace('/admin');
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptFormSchema),
    defaultValues: {
      donorName: '',
      donorAddress: '',
      donorPan: '',
      donorContact: '',
      donorEmail: '',
      amount: undefined as unknown as number,
      donationDate: new Date().toISOString().split('T')[0],
      purpose: '',
      paymentMode: 'UPI',
      paymentReference: '',
    },
    mode: 'onTouched',
  });

  const stepId = FORM_STEPS[currentStep].id;

  /** Go to next step, validating current step fields first */
  async function handleNext() {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
  }

  /** Go to previous step */
  function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  /** Go to a specific step (used by Review's edit buttons) */
  function goToStep(step: number) {
    setCurrentStep(step);
  }

  /** Submit the form — create receipt in Firestore */
  async function onSubmit(data: ReceiptFormValues) {
    if (!user) {
      toast.error('You must be logged in to generate a receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Initialize sequence if first time
      await initializeSequence();

      // Create receipt atomically
      const receipt = await createReceipt(
        {
          donorName: data.donorName,
          donorAddress: data.donorAddress,
          donorPan: data.donorPan || '',
          donorContact: data.donorContact || '',
          donorEmail: data.donorEmail || '',
          amount: data.amount,
          donationDate: data.donationDate,
          purpose: data.purpose || '',
          paymentMode: data.paymentMode,
          paymentReference: data.paymentReference || '',
        },
        user.uid
      );

      toast.success(`Receipt ${receipt.receiptNumber} generated!`);
      router.push(`/receipts/preview?id=${receipt.id}`);
    } catch (error) {
      console.error('Receipt creation failed:', error);
      toast.error('Failed to generate receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm no-print">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold"><span className="text-blue-600">JEEVANKRITI</span> <span className="text-emerald-600">FOUNDATION</span></h1>
              <p className="text-xs text-slate-500">80G Receipt Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Show Role */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Logged in as</span>
              <span className="text-sm font-bold text-emerald-600">Staff</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="text-slate-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Step Progress */}
        <div className="mb-8 no-print">
          <StepProgress currentStep={stepId} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8">
            {/* Step Content */}
            {currentStep === 0 && (
              <DonorDetails register={register} errors={errors} />
            )}
            {currentStep === 1 && (
              <DonationDetails register={register} errors={errors} watch={watch} />
            )}
            {currentStep === 2 && (
              <PaymentDetails register={register} errors={errors} watch={watch} />
            )}
            {currentStep === 3 && (
              <ReviewStep
                getValues={getValues}
                onGoToStep={goToStep}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    currentStep === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewReceiptPage() {
  return (
    <AuthGuard>
      <ReceiptFormContent />
    </AuthGuard>
  );
}
