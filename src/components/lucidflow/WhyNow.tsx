import { JourneyMap } from "./JourneyMap";

export function WhyNow() {
  return (
    <section id="why-lucidflow" className="section-space">
      <div className="container-lf">
        <h2 className="section-heading max-w-3xl">
          Dark-pattern risk is a digital-journey problem.
        </h2>
        <p className="section-copy mt-5">
          Potential risk may emerge in quote, product selection, add-ons, consent, payment,
          renewal, claims, cancellation, campaign and partner journeys. When these journeys
          change, a point-in-time assessment alone may not be enough.
        </p>
        <div className="mt-16 lg:mt-20">
          <JourneyMap />
        </div>
      </div>
    </section>
  );
}
