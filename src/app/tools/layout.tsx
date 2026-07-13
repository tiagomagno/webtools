export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "40px 0", width: "100%" }}>
      {children}
    </div>
  );
}
