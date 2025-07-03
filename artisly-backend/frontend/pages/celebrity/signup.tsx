import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";

export default function Signup() {
  const router = useRouter();
  const [intro, setIntro] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    country: "",
    instagramUrl: "",
    fanbaseCount: 1000,
    thumbnailUrl: "", // ✅ new field
  });

  const handleAI = async () => {
    const res = await fetch(`/api/autofill?q=${intro}`);
    const data = await res.json();
    setForm({ ...form, ...data });
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3001/celeb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const newCeleb = await res.json();
    router.push(`/celebrity/${newCeleb.id}`);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-2">Onboard a Celebrity</h1>
        <input
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="e.g. Punjabi singer from India"
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleAI}
          className="bg-blue-500 text-white px-4 py-2 mb-4"
        >
          Auto-Fill
        </button>

        <div className="space-y-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="border p-2 w-full"
          />
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category"
            className="border p-2 w-full"
          />
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="Country"
            className="border p-2 w-full"
          />
          <input
            value={form.instagramUrl}
            onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
            placeholder="Instagram URL"
            className="border p-2 w-full"
          />
          <input
            type="number"
            value={form.fanbaseCount}
            onChange={(e) =>
              setForm({ ...form, fanbaseCount: Number(e.target.value) })
            }
            placeholder="Fanbase Count"
            className="border p-2 w-full"
          />
          <input
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            placeholder="Thumbnail Image URL"
            className="border p-2 w-full"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2"
          >
            Submit
          </button>
        </div>
      </div>
    </Layout>
  );
}
