import { recentActivity } from "@/lib/data"
import { SectionHeading } from "@/components/ui-bits"
import { CurrencyDot } from "@/components/currency"

const kindToCurrency: Record<string, "xp" | "coin" | "trash" | "reading" | "house"> = {
  xp: "xp",
  house: "house",
  trash: "trash",
  reading: "reading",
  coin: "coin",
  badge: "xp",
}

export function ActivityFeed() {
  return (
    <section>
      <SectionHeading eyebrow="Recently" title="Your activity" />
      <ol className="mt-5">
        {recentActivity.map((item, i) => (
          <li
            key={item.id}
            className="flex items-center gap-4 border-b border-border py-3.5 last:border-b-0"
          >
            <CurrencyDot kind={kindToCurrency[item.type]} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-tight">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium tabular">{item.amount}</p>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
