import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
        NanoSpotify
      </h1>
      <LoginButton />
    </main>
  );
}
