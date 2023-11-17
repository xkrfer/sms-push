import { cn } from "@/lib/utils"
import { getServerSession } from "next-auth"
import NavLink from "./nav-link"

export default async function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const session = await getServerSession()
  if (!session) return <div></div>
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <NavLink text="Overview" href="/overview" />
      <NavLink text="SMS" href="/sms" />
      <NavLink text="Bots" href="/bots" />
    </nav>
  )
}