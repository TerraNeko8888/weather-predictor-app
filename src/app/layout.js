import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Prediksi Cuaca AI - Gemini & BMKG',
  description: 'Aplikasi prediksi cuaca menggunakan AI Gemini dan data BMKG',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
