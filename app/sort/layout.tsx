export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="max-w-screen-xl p-2 md:p-4 mx-auto flex flex-col gap-4 min-h-screen">
      {children}
    </main>
  );
}
