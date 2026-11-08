import Link from "next/link";

import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold">Page Not Found</h1>
      <Link href="/" className="text-violet-light underline underline-offset-4">
        Back to home
      </Link>
    </Container>
  );
}
