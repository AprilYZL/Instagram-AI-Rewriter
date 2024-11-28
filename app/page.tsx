import Image from "next/image";
import Input from './components/input';

export default function Home() {
  const handleSubmit = (message: string) => {
    // Handle the message submission here
    console.log(message, 'test');

  };

  return (
    <main className="min-h-screen bg-[#1e1e1e]">
    {/* Your other components */}
    <Input onSubmit={handleSubmit} />
  </main>
  );
}
