import { Helmet } from "react-helmet-async";
import { AIAutomationSection } from "@/components/lucidflow/AIAutomationSection";
import { BuyerPathSelector } from "@/components/lucidflow/BuyerPathSelector";
import { Capabilities } from "@/components/lucidflow/Capabilities";
import { EngagementModels } from "@/components/lucidflow/EngagementModels";
import { EnquiryModal } from "@/components/lucidflow/EnquiryModal";
import { EnquiryProvider } from "@/components/lucidflow/EnquiryProvider";
import { FAQ } from "@/components/lucidflow/FAQ";
import { FinalCTA } from "@/components/lucidflow/FinalCTA";
import { Footer } from "@/components/lucidflow/Footer";
import { Header } from "@/components/lucidflow/Header";
import { Hero } from "@/components/lucidflow/Hero";
import { HowItWorks } from "@/components/lucidflow/HowItWorks";
import { VideoPlaceholder } from "@/components/lucidflow/VideoPlaceholder";
import { WhyNow } from "@/components/lucidflow/WhyNow";
import { SEO } from "@/data/lucidflowContent";
import { useUtmParams } from "@/hooks/useUtmParams";
import { useEffect } from "react";
import { getGaMeasurementId } from "@/hooks/useAnalytics";

export function LucidFlowPage() {
  // Capture UTM parameters on page load
  useUtmParams();

  // Set up Google Analytics if configured
  useEffect(() => {
    const measurementId = getGaMeasurementId();
    if (measurementId && !document.querySelector(`script[src*="googletagmanager"]`)) {
      // Add GA4 script
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(script2);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "LucidFlow",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description: SEO.description,
            provider: {
              "@type": "Organization",
              name: "SBA Info Solutions",
            },
          })}
        </script>
      </Helmet>

      <EnquiryProvider>
        <Header />
        <main>
          <Hero />
          <AIAutomationSection />
          <BuyerPathSelector />
          <WhyNow />
          <Capabilities />
          <HowItWorks />
          <VideoPlaceholder />
          <EngagementModels />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <EnquiryModal />
      </EnquiryProvider>
    </>
  );
}
