// The real root layout (<html>, Header, Footer) lives in `[locale]/layout.tsx`.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
