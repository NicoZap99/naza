import './ui/global.css';

export default function RootLayout({children,}: {  children: React.ReactNode;}) {
  return (
    <html lang="en">  
      <body style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
         {children}
      </body>
    </html>
  );
}
