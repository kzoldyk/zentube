import { MainHeader } from "@/components/main-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      <MainHeader />
      {children}
    </div>
  );
}
