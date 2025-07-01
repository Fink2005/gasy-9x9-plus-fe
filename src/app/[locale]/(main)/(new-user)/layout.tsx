export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="bg-new-user min-h-screen">
      {props.children}
    </main>
  );
}
