export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="bg-9x9 min-h-screen overflow-y-auto">
      {props.children}
    </main>
  );
}
