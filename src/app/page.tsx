import { SubmitForm } from "./SubmitForm";


export default function Home() {
  return (
    
    <main>
      <p className="text-4xl">Next.js Dev Scout</p>
      <p>Type in any next.js topic, find the developers who contributed the most.</p>
      <hr className="my-8"/>
      <SubmitForm />
    </main>
  );
}
