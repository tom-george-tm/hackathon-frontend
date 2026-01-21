import { Hero } from "@/components/Hero"
import { ChallengeSection } from "@/components/ChallengeSection"
import { ImpactSection } from "@/components/ImpactSection"
import { FocusTracks } from "@/components/FocusTracks"
import { RulesSection } from "@/components/RulesSection"

export function Landing() {
    return (
        <>
            <Hero />
            <ChallengeSection />
            <ImpactSection />
            <FocusTracks />
            <RulesSection />
        </>
    )
}
