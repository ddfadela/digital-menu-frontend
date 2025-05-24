import './globals.css';

export const metadata = {
  title: 'Digital menu',
  description: 'Digital menu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
