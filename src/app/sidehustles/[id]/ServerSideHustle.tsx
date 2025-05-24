import { sideHustles } from "../sideHustles";
import { SideHustlePage } from "./SideHustlePage";
import { notFound } from "next/navigation";

// Server component to handle async params
export async function ServerSideHustle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sideHustle = sideHustles.find((hustle) => hustle.id === id);

  if (!sideHustle) {
    notFound();
  }

  return <SideHustlePage sideHustle={sideHustle} />;
}