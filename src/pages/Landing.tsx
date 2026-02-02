import { Hero } from "@/components/Hero"
import { ChallengeSection } from "@/components/ChallengeSection"
import { ImpactSection } from "@/components/ImpactSection"
import { FocusTracks } from "@/components/FocusTracks"
import { RulesSection } from "@/components/RulesSection"
import { CountdownSection } from "@/components/CountdownSection"

export function Landing() {
    return (
        <>
            <Hero />
            <CountdownSection />
            <ChallengeSection />
            <ImpactSection />
            <FocusTracks />
            <RulesSection />
        </>
    )
}
