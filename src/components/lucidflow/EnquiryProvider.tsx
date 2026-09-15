import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MODAL_HEADINGS } from "@/data/lucidflowContent";
import type { EnquiryPrefill } from "@/lib/types";
import { trackFormOpen } from "@/hooks/useAnalytics";

type EnquiryContextValue = {
  isOpen: boolean;
  prefill: EnquiryPrefill | null;
  heading: string;
  openEnquiry: (prefill: EnquiryPrefill) => void;
  closeEnquiry: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

function resolveHeading(prefill: EnquiryPrefill) {
  if (prefill.heading) return prefill.heading;
  if (prefill.preferredEngagement === "scan") return MODAL_HEADINGS.scan;
  if (prefill.preferredEngagement === "demo") return MODAL_HEADINGS.walkthrough;
  return MODAL_HEADINGS.default;
}

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<EnquiryPrefill | null>(null);

  const openEnquiry = useCallback((nextPrefill: EnquiryPrefill) => {
    setPrefill(nextPrefill);
    setIsOpen(true);
    trackFormOpen({
      sourceSection: nextPrefill.sourceSection ?? "",
      preselectedEngagement: nextPrefill.preferredEngagement,
      buyerStage: nextPrefill.buyerStage,
    });
  }, []);

  const closeEnquiry = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      prefill,
      heading: prefill ? resolveHeading(prefill) : MODAL_HEADINGS.default,
      openEnquiry,
      closeEnquiry,
    }),
    [closeEnquiry, isOpen, openEnquiry, prefill],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiry must be used within EnquiryProvider");
  }
  return context;
}
