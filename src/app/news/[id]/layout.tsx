export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-row items-start ">
      <main className="flex-1 w-full mx-auto md:px-0">{children}</main>
    </div>
  );
}
