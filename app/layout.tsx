import { pixelySans } from './ui/fonts';
import './ui/global.css';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={pixelySans.className + ' antialiased'}>{children}</body>
      {/* <footer className='flex bg-slate-300  text-orange-400 justify-center items-center'>Este es mi footer test</footer> */}
    </html>
  );
}
