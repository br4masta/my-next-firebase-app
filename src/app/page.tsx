import Head from 'next/head'
import app from '../lib/firebase'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next.js + Firebase</title>
      </Head>
      <main>
        <h1>Hello Firebase 👋</h1>
        <p>Firebase App Name: {app.name}</p>
      </main>
    </div>
  )
}
