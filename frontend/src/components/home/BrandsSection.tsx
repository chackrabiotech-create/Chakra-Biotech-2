import { QualityCertification } from "@/components/ui/quality-certification";

export function BrandsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-4">
        <QualityCertification 
          variant="full"
          showMetrics={true}
          showCertifications={true}
          animated={true}
          className="max-w-6xl mx-auto"
        />
      </div>
    </section>
  );
}
