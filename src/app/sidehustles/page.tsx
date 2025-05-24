import { sideHustles } from "./sideHustles";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SideHustlesPage() {
  return (
    <>
      <Navbar />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Explore Side Hustles</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sideHustles.map((hustle) => (
              <Card key={hustle.id} className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{hustle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{hustle.description}</p>
                  <Link
                    href={`/sidehustles/${hustle.id}`}
                    className="text-primary hover:underline"
                  >
                    Learn More
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}