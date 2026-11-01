import { toolMetadata } from "../../lib/seo";
import MoodboardBuilder from "./MoodboardBuilder";

export const metadata = toolMetadata({
  slug: "moodboard",
  title: "Criador de Moodboard Online — Branding, App e Website",
  description:
    "Crie moodboards de branding, app mobile ou website com logo, prints, paletas de cor e tipografia. Monte o board arrastando os elementos e baixe em PNG. Tudo no navegador, sem upload.",
  keywords: ["criador de moodboard", "moodboard online", "moodboard branding", "moodboard app", "moodboard website"],
});

export default function Page() {
  return <MoodboardBuilder />;
}
