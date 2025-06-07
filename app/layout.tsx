import './ui/global.css';

export default function RootLayout({children,}: {  children: React.ReactNode;}) {
  return (
    <html lang="en">  
      <body>
        <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-green-800 dark:from-white dark:via-green-100 dark:to-green-300 transition-colors duration-300 p-8">
          {children}
        </div>
      </body>
    </html>
  );
}
