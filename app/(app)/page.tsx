import { Greeting } from "@/components/home/greeting"
import { Challenges } from "@/components/home/challenges"
import { ActivityFeed } from "@/components/home/activity-feed"
import { HomeAside } from "@/components/home/home-aside"

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <Greeting />
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-10">
          <Challenges />
          <ActivityFeed />
        </div>
        <HomeAside />
      </div>
    </div>
  )
}
