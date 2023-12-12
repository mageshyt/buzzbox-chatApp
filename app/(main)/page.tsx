import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
