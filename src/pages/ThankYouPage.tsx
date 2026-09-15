import { Helmet } from "react-helmet-async";
import { Header } from "@/components/lucidflow/Header";
import { Footer } from "@/components/lucidflow/Footer";
import { EnquiryProvider } from "@/components/lucidflow/EnquiryProvider";
import { EnquiryModal } from "@/components/lucidflow/EnquiryModal";
import { DownloadOverview } from "@/components/lucidflow/DownloadOverview";
import { SEO } from "@/data/lucidflowContent";

export function ThankYouPage() {
  const pdfAvailable = true; // PDF exists at /journey-assurance-scan-overview.pdf

  return (
    <>
      <Helmet>
        <title>Thank you | {SEO.title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <EnquiryProvider>
        <Header />
        <main className="flex min-h-[80vh] items-center">
          <div className="container-lf py-28">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Thank you.</h1>
            {pdfAvailable ? (
              <DownloadOverview pdfAvailable />
            ) : (
              <>
                <p className="mt-5 max-w-xl text-lg leading-8 text-muted-grey">
                  We will contact you within one business day.
                </p>
                <p className="mt-3 text-muted-grey">
                  The overview will be available shortly.
                </p>
              </>
            )}
          </div>
        </main>
        <Footer />
        <EnquiryModal />
      </EnquiryProvider>
    </>
  );
}
