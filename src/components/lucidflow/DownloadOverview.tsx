import { PDF_FILE_NAME, PDF_PUBLIC_PATH } from "@/data/lucidflowContent";
import { trackPdfDownload } from "@/hooks/useAnalytics";
import { trackPdfDownload as trackPdfDownloadGA4 } from "@/lib/ga4";

export function DownloadOverview({ pdfAvailable }: { pdfAvailable: boolean }) {
  if (!pdfAvailable) {
    return <p className="mt-5 text-lg leading-8 text-muted-grey">The overview will be available shortly.</p>;
  }

  return (
    <p className="mt-5 max-w-xl text-lg leading-8 text-muted-grey">
      We will contact you within one business day. In the meantime, download the{" "}
      <a
        href={PDF_PUBLIC_PATH}
        download={PDF_FILE_NAME}
        className="text-light-text underline underline-offset-4"
        onClick={() => {
          trackPdfDownload({
            fileName: PDF_FILE_NAME,
            pageLocation: "thank_you_page",
          });
          trackPdfDownloadGA4({
            file_name: PDF_FILE_NAME,
            page_location: "thank_you_page",
          });
        }}
      >
        Journey Assurance Scan overview [PDF]
      </a>
      .
    </p>
  );
}
