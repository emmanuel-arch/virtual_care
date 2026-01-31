import { PortfolioNavbar } from "@/components/PortfolioNavbar"
import { ProductTeaserCard } from "@/components/ProductTeaserCard"
import { BankingScaleHero } from "@/components/BankingScaleHero"
import { CaseStudiesCarousel } from "@/components/CaseStudiesCarousel"
import { IntegrationCarousel } from "@/components/IntegrationCarousel"
import { FAQSection } from "@/components/FAQSection"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <PortfolioNavbar />
      <ProductTeaserCard />
      <BankingScaleHero />
      <CaseStudiesCarousel />
      <IntegrationCarousel />
      <FAQSection />
      <Footer />
    </>
  )
}
