import { NextLink } from "@/components/PageHead";
import { PageHead } from "@/components/PageHead";

export default function NotFound() {
  return (
    <div className="page">
      <PageHead
        title="Not found"
        subtitle="Nothing at this address"
        lede="The page you asked for does not exist. The menu on the left still works."
      />
      <NextLink href="/" label="Back to the start" />
    </div>
  );
}
